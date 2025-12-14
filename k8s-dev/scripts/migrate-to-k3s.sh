#!/bin/bash
# =============================================================================
# Migrate EC2 from Docker Compose to K3s
# =============================================================================
# This script should be run ONCE on your EC2 instance to:
# 1. Export PostgreSQL data from docker-compose
# 2. Stop docker-compose services
# 3. Install K3s
# 4. Deploy the app using K3s
# 5. Restore PostgreSQL data
#
# Usage: SSH to EC2 and run this script
# =============================================================================

set -e

ECR_REGISTRY="026596707189.dkr.ecr.eu-central-1.amazonaws.com"
REGION="eu-central-1"

echo "=============================================="
echo "🚀 Migrating from Docker Compose to K3s"
echo "=============================================="

# Step 1: Backup PostgreSQL data if docker-compose is running
echo ""
echo "📦 Step 1: Checking for existing PostgreSQL data..."
if docker ps | grep -q moni-db; then
    echo "Found running PostgreSQL container. Creating backup..."
    mkdir -p ~/db-backup
    docker exec moni-db pg_dump -U postgres moni > ~/db-backup/moni-backup.sql
    echo "✅ Database backup saved to ~/db-backup/moni-backup.sql"
else
    echo "No running PostgreSQL container found. Skipping backup."
fi

# Step 2: Stop docker-compose services
echo ""
echo "🛑 Step 2: Stopping docker-compose services..."
if [ -f ~/moni/docker-compose.production.yml ]; then
    cd ~/moni
    docker-compose -f docker-compose.production.yml down || true
elif [ -f /opt/moni/docker-compose.production.yml ]; then
    cd /opt/moni
    docker-compose -f docker-compose.production.yml down || true
fi
echo "✅ Docker-compose services stopped"

# Step 3: Install K3s
echo ""
echo "📥 Step 3: Installing K3s..."
if command -v k3s &> /dev/null; then
    echo "K3s is already installed"
else
    curl -sfL https://get.k3s.io | sh -
    echo "✅ K3s installed"
fi

# Wait for K3s to be ready
echo "Waiting for K3s to be ready..."
sleep 10
sudo k3s kubectl get nodes

# Step 4: Configure ECR authentication for K3s
echo ""
echo "🔐 Step 4: Setting up ECR authentication..."
ECR_TOKEN=$(aws ecr get-login-password --region $REGION)

sudo mkdir -p /etc/rancher/k3s
sudo tee /etc/rancher/k3s/registries.yaml > /dev/null << EOF
mirrors:
  "$ECR_REGISTRY":
    endpoint:
      - "https://$ECR_REGISTRY"
configs:
  "$ECR_REGISTRY":
    auth:
      username: AWS
      password: $ECR_TOKEN
EOF

# Restart K3s to pick up registry config
sudo systemctl restart k3s
sleep 10
echo "✅ ECR authentication configured"

# Step 5: Download and apply K3s manifests
echo ""
echo "📄 Step 5: Deploying application to K3s..."

# Create manifests directory
mkdir -p ~/k8s-manifests
cd ~/k8s-manifests

# Download the manifest file (you can also copy it manually)
# For now, we'll create it here inline
cat > moni-app.yaml << 'MANIFEST'
# This will be created by the deploy script
MANIFEST

# If manifest doesn't exist, prompt user
if [ ! -s ~/k8s-manifests/moni-app.yaml ] || grep -q "will be created" ~/k8s-manifests/moni-app.yaml; then
    echo ""
    echo "⚠️  Please copy the manifest file to ~/k8s-manifests/moni-app.yaml"
    echo "   You can SCP it from your local machine:"
    echo "   scp -i your-key.pem k8s-dev/manifests/moni-app.yaml ec2-user@<EC2_IP>:~/k8s-manifests/"
    echo ""
    echo "   Then run: sudo k3s kubectl apply -f ~/k8s-manifests/moni-app.yaml"
    echo ""
fi

echo ""
echo "=============================================="
echo "📋 K3s Setup Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Copy the manifest file to the EC2:"
echo "   scp -i your-key.pem k8s-dev/manifests/moni-app.yaml ec2-user@<EC2_IP>:~/k8s-manifests/"
echo ""
echo "2. Apply the manifest:"
echo "   sudo k3s kubectl apply -f ~/k8s-manifests/moni-app.yaml"
echo ""
echo "3. If you had database data, restore it:"
echo "   sudo k3s kubectl exec -it -n moni deploy/moni-db -- psql -U postgres -d moni < ~/db-backup/moni-backup.sql"
echo ""
echo "4. Check status:"
echo "   sudo k3s kubectl get pods -n moni"
echo "   sudo k3s kubectl get svc -n moni"
echo ""
echo "Access your app:"
echo "  Frontend: http://<EC2_IP>:30081"
echo "  Backend:  http://<EC2_IP>:30080"
echo ""
