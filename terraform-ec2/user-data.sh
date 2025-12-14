#!/bin/bash
# User data script for K3s installation on Amazon Linux 2023

set -e

# Log everything
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Update system
dnf update -y

# Install required packages
dnf install -y --allowerasing curl wget docker git jq

# Start and enable Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Pre-login Docker to ECR (as root, since K3s with --docker runs as root)
echo "Pre-authenticating Docker with ECR..."
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 026596707189.dkr.ecr.eu-central-1.amazonaws.com || true

# Install K3s with Docker runtime
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${k3s_version}" sh -s - \
    --docker \
    --write-kubeconfig-mode 644 \
    --node-name "${project_name}-${environment}"

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

# Refresh ECR credentials first
/home/ec2-user/refresh-ecr-credentials.sh

# Apply the Kubernetes manifests
sudo k3s kubectl apply -f /home/ec2-user/moni-app.yaml

# Wait for deployment
echo "Waiting for pods to be ready..."
sudo k3s kubectl wait --for=condition=ready pod -l app=moni-db -n moni --timeout=300s || true
sudo k3s kubectl wait --for=condition=ready pod -l app=moni-be -n moni --timeout=300s || true
sudo k3s kubectl wait --for=condition=ready pod -l app=moni-fe -n moni --timeout=300s || true

# Show status
sudo k3s kubectl get pods -n moni
sudo k3s kubectl get svc -n moni

# Get access URLs
echo ""
echo "=== ACCESS INFORMATION ==="
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Frontend: http://$PUBLIC_IP:30081"
echo "Backend:  http://$PUBLIC_IP:30080"
echo ""
echo "Application deployed successfully!"
EOF

chmod +x /home/ec2-user/deploy-moni.sh
chown ec2-user:ec2-user /home/ec2-user/deploy-moni.sh

# Create ECR credential refresh script
cat > /home/ec2-user/refresh-ecr-credentials.sh << 'EOF'
#!/bin/bash
# Refresh ECR credentials for K3s

ECR_REGISTRY="026596707189.dkr.ecr.eu-central-1.amazonaws.com"
ECR_TOKEN=$(aws ecr get-login-password --region eu-central-1)

sudo tee /etc/rancher/k3s/registries.yaml > /dev/null << REGISTRIES
mirrors:
  "$ECR_REGISTRY":
    endpoint:
      - "https://$ECR_REGISTRY"
configs:
  "$ECR_REGISTRY":
    auth:
      username: AWS
      password: $ECR_TOKEN
REGISTRIES

echo "ECR credentials refreshed. Restarting K3s..."
sudo systemctl restart k3s
sleep 10
echo "K3s restarted."
EOF

chmod +x /home/ec2-user/refresh-ecr-credentials.sh
chown ec2-user:ec2-user /home/ec2-user/refresh-ecr-credentials.sh

# Create helpful aliases for ec2-user
cat >> /home/ec2-user/.bashrc << 'EOF'

# K3s/Kubernetes aliases
alias k='sudo k3s kubectl'
alias kgp='sudo k3s kubectl get pods'
alias kgs='sudo k3s kubectl get svc'
alias kgn='sudo k3s kubectl get nodes'
alias kga='sudo k3s kubectl get all'
alias kns='sudo k3s kubectl config set-context --current --namespace'

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
    sudo k3s kubectl get nodes
    echo ""
    echo "=== Pods in moni namespace ==="
    sudo k3s kubectl get pods -n moni
}

moni-logs() {
    echo "=== Frontend Logs ==="
    sudo k3s kubectl logs -l app=moni-fe -n moni --tail=20
    echo ""
    echo "=== Backend Logs ==="
    sudo k3s kubectl logs -l app=moni-be -n moni --tail=20
}

moni-status() {
    echo "=== Pods ==="
    sudo k3s kubectl get pods -n moni
    echo ""
    echo "=== Services ==="
    sudo k3s kubectl get svc -n moni
    echo ""
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    echo "=== Access URLs ==="
    echo "Frontend: http://$PUBLIC_IP:30081"
    echo "Backend:  http://$PUBLIC_IP:30080"
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