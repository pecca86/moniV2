#!/bin/bash
# User data script for K3s installation on Amazon Linux 2023

set -e

# Log everything
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=========================================="
echo "Starting K3s installation..."
echo "K3s Version: ${k3s_version}"
echo "Project: ${project_name}-${environment}"
echo "=========================================="

# Update system
echo "Updating system packages..."
dnf update -y

# Install required packages
echo "Installing required packages..."
dnf install -y --allowerasing curl wget docker git jq nc

# Start and enable Docker (used by K3s)
echo "Starting Docker..."
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install K3s with Docker as container runtime
echo "Installing K3s..."
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${k3s_version}" sh -s - \
    --docker \
    --write-kubeconfig-mode 644 \
    --node-name "${project_name}-${environment}"

# Wait for K3s to be ready
echo "Waiting for K3s to be ready..."
sleep 30
timeout=120
elapsed=0
while ! kubectl get nodes >/dev/null 2>&1 && [ $elapsed -lt $timeout ]; do
    echo "Waiting for K3s... ($elapsed/$timeout seconds)"
    sleep 5
    elapsed=$((elapsed + 5))
done

if kubectl get nodes >/dev/null 2>&1; then
    echo "✅ K3s is ready!"
    kubectl get nodes
else
    echo "❌ K3s failed to start"
    systemctl status k3s --no-pager
    exit 1
fi

# Create namespace for the application
echo "Creating moni namespace..."
kubectl create namespace moni || true

# Set up kubectl for ec2-user
mkdir -p /home/ec2-user/.kube
cp /etc/rancher/k3s/k3s.yaml /home/ec2-user/.kube/config
chown -R ec2-user:ec2-user /home/ec2-user/.kube

# Create the Kubernetes manifest for Moni application
echo "Creating Kubernetes manifest..."
cat > /home/ec2-user/moni-k8s.yaml << 'MANIFEST'
# Moni Application Kubernetes Manifests
# Deploy with: kubectl apply -f moni-k8s.yaml

---
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: moni

---
# Database Secret
apiVersion: v1
kind: Secret
metadata:
  name: moni-db-secret
  namespace: moni
type: Opaque
data:
  password: cGVra2E=  # base64 encoded "pekka" - CHANGE IN PRODUCTION!

---
# Persistent Volume Claim for PostgreSQL
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: moni-pvc
  namespace: moni
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path  # K3s default storage class
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
  labels:
    app: moni-db
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
          image: postgres:16
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
              name: moni-storage
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - postgres
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - postgres
            initialDelaySeconds: 30
            periodSeconds: 10
      volumes:
        - name: moni-storage
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
  type: ClusterIP
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
  labels:
    app: moni-be
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
          image: busybox
          command: ['sh', '-c', 'until nc -z moni-db 5432; do echo waiting for db; sleep 2; done;']
      containers:
        - name: moni-be
          image: ${ecr_backend_url}:latest
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
              value: "prod"
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          # Note: Health checks removed to simplify - add back with proper actuator setup

---
# Backend Service (NodePort for external access)
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
      nodePort: 30080
  selector:
    app: moni-be

---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moni-fe
  namespace: moni
  labels:
    app: moni-fe
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
          image: ${ecr_frontend_url}:latest
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

---
# Frontend Service (NodePort for external access)
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
      nodePort: 30081
  selector:
    app: moni-fe
MANIFEST

chown ec2-user:ec2-user /home/ec2-user/moni-k8s.yaml

# Create deployment helper script
cat > /home/ec2-user/deploy-moni.sh << 'EOF'
#!/bin/bash
# Deploy Moni application to K3s

set -e

echo "=========================================="
echo "  Deploying Moni Application to K3s"
echo "=========================================="

# Authenticate to ECR
echo "Authenticating to ECR..."
aws ecr get-login-password --region ${aws_region} | docker login --username AWS --password-stdin 026596707189.dkr.ecr.${aws_region}.amazonaws.com

# Apply the Kubernetes manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f /home/ec2-user/moni-k8s.yaml

# Wait for deployments
echo ""
echo "Waiting for deployments to be ready..."
echo "(This may take 2-3 minutes for first deployment)"

echo "  → Waiting for database..."
kubectl wait --for=condition=available deployment/moni-db -n moni --timeout=120s || true

echo "  → Waiting for backend..."
kubectl wait --for=condition=available deployment/moni-be -n moni --timeout=180s || true

echo "  → Waiting for frontend..."
kubectl wait --for=condition=available deployment/moni-fe -n moni --timeout=120s || true

# Show status
echo ""
echo "=========================================="
echo "  Deployment Status"
echo "=========================================="
kubectl get pods -n moni
echo ""
kubectl get svc -n moni

# Get access URLs
echo ""
echo "=========================================="
echo "  ACCESS INFORMATION"
echo "=========================================="
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Frontend: http://$PUBLIC_IP:30081"
echo "Backend:  http://$PUBLIC_IP:30080"
echo ""
echo "✅ Deployment complete!"
EOF

chmod +x /home/ec2-user/deploy-moni.sh
chown ec2-user:ec2-user /home/ec2-user/deploy-moni.sh

# Create status check helper script
cat > /home/ec2-user/k3s-status.sh << 'EOF'
#!/bin/bash
# Check K3s cluster and application status

echo "=========================================="
echo "  K3s Cluster Status"
echo "=========================================="
echo ""
echo "K3s Service:"
sudo systemctl status k3s --no-pager | head -5
echo ""
echo "Nodes:"
kubectl get nodes
echo ""
echo "All Pods:"
kubectl get pods -A
echo ""
echo "=========================================="
echo "  Moni Application Status"
echo "=========================================="
echo ""
echo "Moni Namespace Resources:"
kubectl get all -n moni
echo ""
echo "Persistent Volume Claims:"
kubectl get pvc -n moni
echo ""
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Access URLs:"
echo "  Frontend: http://$PUBLIC_IP:30081"
echo "  Backend:  http://$PUBLIC_IP:30080"
EOF

chmod +x /home/ec2-user/k3s-status.sh
chown ec2-user:ec2-user /home/ec2-user/k3s-status.sh

# Create helpful aliases for ec2-user
cat >> /home/ec2-user/.bashrc << 'ALIASES'

# Kubernetes aliases
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgpw='kubectl get pods -w'
alias kgs='kubectl get svc'
alias kgn='kubectl get nodes'
alias kga='kubectl get all'
alias kgall='kubectl get all -n moni'
alias kns='kubectl config set-context --current --namespace'
alias kdp='kubectl describe pod'
alias kds='kubectl describe svc'
alias kdd='kubectl describe deployment'

# Moni shortcuts
alias moni-pods='kubectl get pods -n moni'
alias moni-logs-be='kubectl logs -l app=moni-be -n moni -f'
alias moni-logs-fe='kubectl logs -l app=moni-fe -n moni -f'
alias moni-logs-db='kubectl logs -l app=moni-db -n moni -f'
alias moni-status='/home/ec2-user/k3s-status.sh'
alias moni-deploy='/home/ec2-user/deploy-moni.sh'

# Quick functions
k3s-status() {
    /home/ec2-user/k3s-status.sh
}

moni-logs() {
    echo "=== Database Logs ==="
    kubectl logs -l app=moni-db -n moni --tail=10
    echo ""
    echo "=== Backend Logs ==="
    kubectl logs -l app=moni-be -n moni --tail=10
    echo ""
    echo "=== Frontend Logs ==="
    kubectl logs -l app=moni-fe -n moni --tail=10
}

moni-restart() {
    echo "Restarting all Moni deployments..."
    kubectl rollout restart deployment/moni-db -n moni
    kubectl rollout restart deployment/moni-be -n moni
    kubectl rollout restart deployment/moni-fe -n moni
    echo "Restart initiated. Use 'moni-pods' to watch status."
}

moni-shell-be() {
    POD=$(kubectl get pods -l app=moni-be -n moni -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -it $POD -n moni -- /bin/sh
}

moni-shell-db() {
    POD=$(kubectl get pods -l app=moni-db -n moni -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -it $POD -n moni -- psql -U postgres -d moni
}

ALIASES

# Set ownership
chown -R ec2-user:ec2-user /home/ec2-user/

# Log installation completion
echo "=========================================="
echo "K3s installation completed successfully!"
echo "=========================================="
echo "K3s version: ${k3s_version}"
echo "Project: ${project_name}-${environment}"
echo ""
echo "Useful commands:"
echo "  moni-deploy  - Deploy the Moni application"
echo "  moni-status  - Check cluster and app status"
echo "  moni-logs    - View application logs"
echo "  moni-pods    - List pods in moni namespace"
echo ""

# Final status check
echo "K3s cluster status:"
kubectl get nodes
