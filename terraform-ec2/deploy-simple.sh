#!/bin/bash

# Simplified Moni Application Deployment Script
# Uses existing Docker Compose configuration instead of recreating it

set -e  # Exit on any error

echo "🚀 Starting Moni Application Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Auto-detect SSH key file
SSH_KEY=$(find . -name "*-key.pem" -type f | head -1)
if [ -z "$SSH_KEY" ]; then
    print_error "No SSH key file found! Expected *-key.pem"
    print_error "Run 'terraform apply' to generate the SSH key"
    exit 1
fi
print_status "Using SSH key: $SSH_KEY"

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    print_error "terraform.tfvars file not found!"
    print_status "Please copy terraform.tfvars.example to terraform.tfvars and fill in your values"
    exit 1
fi

# Extract variables from terraform.tfvars
ECR_BACKEND_URI=$(grep 'ecr_backend_uri' terraform.tfvars | cut -d'"' -f2)
ECR_FRONTEND_URI=$(grep 'ecr_frontend_uri' terraform.tfvars | cut -d'"' -f2)
AWS_REGION=$(grep 'aws_region' terraform.tfvars | cut -d'"' -f2)

if [ -z "$ECR_BACKEND_URI" ] || [ -z "$ECR_FRONTEND_URI" ]; then
    print_error "ECR URIs not found in terraform.tfvars"
    exit 1
fi

print_status "🏗️  Step 1: Deploying AWS Infrastructure..."
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Get the EC2 instance IP
INSTANCE_IP=$(terraform output -raw instance_public_ip)
print_success "EC2 Instance deployed at: $INSTANCE_IP"

print_status "⏳ Step 2: Waiting for EC2 instance to be ready..."
sleep 60

# Test SSH connectivity
print_status "🔌 Step 3: Testing SSH connectivity..."
for i in {1..10}; do
    if ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ec2-user@$INSTANCE_IP "echo 'SSH connection successful'" 2>/dev/null; then
        print_success "SSH connection established"
        break
    else
        print_warning "SSH attempt $i/10 failed, retrying in 10 seconds..."
        sleep 10
        if [ $i -eq 10 ]; then
            print_error "Failed to establish SSH connection after 10 attempts"
            exit 1
        fi
    fi
done

print_status "🐳 Step 4: Uploading deployment files to EC2..."

# Create deployment directory and upload files
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@$INSTANCE_IP "mkdir -p ~/moni-deployment/{nginx-config,scripts}"

# Upload Docker Compose configuration
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.production.yml ec2-user@$INSTANCE_IP:~/moni-deployment/docker-compose.yml

# Upload nginx configuration
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no nginx-config-template/default.conf ec2-user@$INSTANCE_IP:~/moni-deployment/nginx-config/

# Create environment file with ECR URIs
cat > .env.production << EOF
ECR_BACKEND_URI=$ECR_BACKEND_URI:latest
ECR_FRONTEND_URI=$ECR_FRONTEND_URI:latest
AWS_REGION=$AWS_REGION
EOF

scp -i "$SSH_KEY" -o StrictHostKeyChecking=no .env.production ec2-user@$INSTANCE_IP:~/moni-deployment/.env
rm .env.production

print_status "🔐 Step 5: Deploying application..."

# Deploy the application
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@$INSTANCE_IP << 'DEPLOY_EOF'
set -e

cd ~/moni-deployment

echo "Authenticating with ECR..."
aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $(grep ECR_BACKEND_URI .env | cut -d'=' -f2 | cut -d':' -f1)

echo "Starting Moni Application..."
sudo docker-compose --env-file .env up -d

echo "Waiting for services to start..."
sleep 30

echo "Checking application status..."
sudo docker-compose ps

# Test endpoints
echo "Testing backend API..."
curl -s http://localhost:30080/api/v1/transactions/categories | head -20 || echo "Backend not ready yet..."

echo "Testing frontend..."
curl -s -I http://localhost:30081 | head -2 || echo "Frontend not ready yet..."

DEPLOY_EOF

print_success "🎉 Deployment Complete!"

print_status "📋 Verifying deployment..."

# Final verification
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@$INSTANCE_IP << 'VERIFY_EOF'
cd ~/moni-deployment
echo "=== Final Application Status ==="
sudo docker-compose ps

echo -e "\nTesting APIs..."
echo "Categories: $(curl -s http://localhost:30080/api/v1/transactions/categories | jq length 2>/dev/null || echo 'Loading...')"
echo "Frontend proxy: $(curl -s http://localhost:30081/api/v1/transactions/categories | jq length 2>/dev/null || echo 'Loading...')"
VERIFY_EOF

print_success "🌟 Moni Application Successfully Deployed!"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://$INSTANCE_IP:30081"
echo "   Backend:  http://$INSTANCE_IP:30080"
echo "   API:      http://$INSTANCE_IP:30080/api/v1/transactions/categories"
echo ""
echo "🔧 Management Commands (run on EC2):"
echo "   Status: cd ~/moni-deployment && sudo docker-compose ps"
echo "   Logs:   cd ~/moni-deployment && sudo docker-compose logs -f"
echo "   Stop:   cd ~/moni-deployment && sudo docker-compose down"
echo "   Start:  cd ~/moni-deployment && sudo docker-compose up -d"
echo ""
echo "📝 To destroy the infrastructure later, run:"
echo "   terraform destroy"