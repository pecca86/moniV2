# Kubernetes manifest template for Moni application on K3s
# This template will be filled with actual values by Terraform

# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: moni
---
# ConfigMap for application configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: moni-config
  namespace: moni
data:
  ENVIRONMENT: "${environment}"
  # Add any other environment-specific configuration
---
# Secret for database credentials
apiVersion: v1
kind: Secret
metadata:
  name: moni-db-secret
  namespace: moni
type: Opaque
data:
  password: cGVra2E=  # base64 encoded "pekka" - CHANGE THIS!
---
# Persistent Volume for database
apiVersion: v1
kind: PersistentVolume
metadata:
  name: moni-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  hostPath:
    path: /opt/moni-data
---
# Persistent Volume Claim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: moni-pvc
  namespace: moni
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  resources:
    requests:
      storage: 5Gi
---
# PostgreSQL Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moni-db
  namespace: moni
spec:
  replicas: 1
  selector:
    matchLabels:
      app: moni-db
  template:
    metadata:
      labels:
        app: moni-db
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_USER
              value: "postgres"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: moni-db-secret
                  key: password
            - name: POSTGRES_DB
              value: "moni"
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          ports:
            - containerPort: 5432
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgres-storage
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - postgres
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - postgres
            initialDelaySeconds: 5
            periodSeconds: 5
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: moni-pvc
---
# PostgreSQL Service
apiVersion: v1
kind: Service
metadata:
  name: moni-db
  namespace: moni
spec:
  ports:
    - port: 5432
      targetPort: 5432
  selector:
    app: moni-db
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moni-be
  namespace: moni
spec:
  replicas: 1
  selector:
    matchLabels:
      app: moni-be
  template:
    metadata:
      labels:
        app: moni-be
    spec:
      initContainers:
        - name: wait-for-postgres
          image: busybox:1.35
          command: ['sh', '-c', 'until nc -z moni-db 5432; do echo waiting for db; sleep 2; done;']
      containers:
        - name: moni-be
          image: ${backend_image}
          imagePullPolicy: Always
          env:
            - name: SPRING_DATASOURCE_URL
              value: "jdbc:postgresql://moni-db:5432/moni"
            - name: SPRING_DATASOURCE_USERNAME
              value: "postgres"
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: moni-db-secret
                  key: password
            - name: SPRING_PROFILES_ACTIVE
              value: "${environment}"
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
---
# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: moni-be
  namespace: moni
spec:
  type: NodePort
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 30080  # Fixed NodePort for consistent access
  selector:
    app: moni-be
---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moni-fe
  namespace: moni
spec:
  replicas: 1
  selector:
    matchLabels:
      app: moni-fe
  template:
    metadata:
      labels:
        app: moni-fe
    spec:
      containers:
        - name: moni-fe
          image: ${frontend_image}
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "250m"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: moni-fe
  namespace: moni
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080  # Same as backend for simplicity in single-node setup
  selector:
    app: moni-fe
%{ if domain_name != "" }
---
# Ingress for custom domain
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: moni-ingress
  namespace: moni
  annotations:
    kubernetes.io/ingress.class: traefik
    %{ if enable_ssl }
    cert-manager.io/cluster-issuer: letsencrypt-prod
    traefik.ingress.kubernetes.io/redirect-entry-point: https
    %{ endif }
spec:
  %{ if enable_ssl }
  tls:
    - hosts:
        - ${domain_name}
      secretName: moni-tls
  %{ endif }
  rules:
    - host: ${domain_name}
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: moni-be
                port:
                  number: 8080
          - path: /
            pathType: Prefix
            backend:
              service:
                name: moni-fe
                port:
                  number: 80
%{ endif }