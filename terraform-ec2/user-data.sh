#!/bin/bash
# User data script for K3s installation on Amazon Linux 2023

set -e

# Update system
dnf update -y

# Install required packages
dnf install -y curl wget docker git

# Start and enable Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install K3s
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${k3s_version}" sh -s - \
    --docker \
    --write-kubeconfig-mode 644 \
    --node-name "${project_name}-${environment}" \
    --cluster-init

# Wait for K3s to be ready
while ! kubectl get nodes >/dev/null 2>&1; do
    sleep 5
done

# Create namespace for the application
kubectl create namespace moni || true

# Set up kubectl for ec2-user
mkdir -p /home/ec2-user/.kube
cp /etc/rancher/k3s/k3s.yaml /home/ec2-user/.kube/config
chown ec2-user:ec2-user /home/ec2-user/.kube/config

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Create a simple ingress controller setup script
cat > /home/ec2-user/setup-ingress.sh << 'EOF'
#!/bin/bash
# Install Traefik Ingress Controller (comes with K3s by default, but configure it)

# Create Traefik configuration
kubectl apply -f - << 'YAML'
apiVersion: v1
kind: Service
metadata:
  name: traefik
  namespace: kube-system
spec:
  type: LoadBalancer
  ports:
    - port: 80
      name: http
      targetPort: 8000
    - port: 443
      name: https
      targetPort: 8443
  selector:
    app.kubernetes.io/name: traefik
YAML

echo "Traefik ingress controller configured"
EOF

chmod +x /home/ec2-user/setup-ingress.sh
chown ec2-user:ec2-user /home/ec2-user/setup-ingress.sh

%{ if enable_ssl && domain_name != "" }
# Install Certbot for Let's Encrypt SSL
dnf install -y certbot

# Create SSL certificate script
cat > /home/ec2-user/setup-ssl.sh << 'EOF'
#!/bin/bash
# Setup Let's Encrypt SSL certificate

# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml

# Wait for cert-manager to be ready
kubectl wait --for=condition=ready pod -l app=cert-manager -n cert-manager --timeout=300s

# Create ClusterIssuer for Let's Encrypt
kubectl apply -f - << 'YAML'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@${domain_name}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
YAML

echo "SSL setup completed"
EOF

chmod +x /home/ec2-user/setup-ssl.sh
chown ec2-user:ec2-user /home/ec2-user/setup-ssl.sh
%{ endif }

# Create application deployment helper script
cat > /home/ec2-user/deploy-moni.sh << 'EOF'
#!/bin/bash
# Deploy Moni application

echo "Deploying Moni application..."

# Apply the Kubernetes manifests
kubectl apply -f /home/ec2-user/moni-k3s.yaml

# Wait for deployment
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=moni-fe -n moni --timeout=300s
kubectl wait --for=condition=ready pod -l app=moni-be -n moni --timeout=300s

# Show status
kubectl get pods -n moni
kubectl get svc -n moni

# Get access URLs
echo ""
echo "=== ACCESS INFORMATION ==="
NODE_PORT_FE=$(kubectl get svc moni-fe -n moni -o jsonpath='{.spec.ports[0].nodePort}')
NODE_PORT_BE=$(kubectl get svc moni-be -n moni -o jsonpath='{.spec.ports[0].nodePort}')
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Frontend: http://$PUBLIC_IP:$NODE_PORT_FE"
echo "Backend:  http://$PUBLIC_IP:$NODE_PORT_BE"
echo ""
echo "Application deployed successfully!"
EOF

chmod +x /home/ec2-user/deploy-moni.sh
chown ec2-user:ec2-user /home/ec2-user/deploy-moni.sh

# Create helpful aliases for ec2-user
cat >> /home/ec2-user/.bashrc << 'EOF'

# K3s/Kubernetes aliases
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgn='kubectl get nodes'
alias kga='kubectl get all'
alias kns='kubectl config set-context --current --namespace'

# Docker aliases
alias d='docker'
alias dps='docker ps'
alias di='docker images'

# Custom functions
k3s-status() {
    echo "=== K3s Status ==="
    sudo systemctl status k3s --no-pager
    echo ""
    echo "=== Nodes ==="
    kubectl get nodes
    echo ""
    echo "=== Pods ==="
    kubectl get pods -A
}

moni-logs() {
    echo "=== Frontend Logs ==="
    kubectl logs -l app=moni-fe -n moni --tail=20
    echo ""
    echo "=== Backend Logs ==="
    kubectl logs -l app=moni-be -n moni --tail=20
}
EOF

# Set ownership
chown -R ec2-user:ec2-user /home/ec2-user/

# Log installation completion
echo "$(date): K3s installation completed successfully" >> /var/log/k3s-install.log
echo "K3s version: ${k3s_version}" >> /var/log/k3s-install.log
echo "Project: ${project_name}-${environment}" >> /var/log/k3s-install.log

# Final status check
systemctl status k3s --no-pager >> /var/log/k3s-install.log