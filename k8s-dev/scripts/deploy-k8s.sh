#!/bin/bash
# Deploy Moni application to K3s cluster
# Usage: ./deploy-k8s.sh <EC2_IP>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"
MANIFESTS_DIR="$SCRIPT_DIR/../manifests"

# Check if IP is provided
if [ -z "$1" ]; then
    # Try to get IP from terraform output
    if [ -f "$TERRAFORM_DIR/kubeconfig" ]; then
        EC2_IP=$(grep "server:" "$TERRAFORM_DIR/kubeconfig" | sed 's/.*https:\/\/\([^:]*\).*/\1/')
        echo -e "${YELLOW}Using IP from kubeconfig: $EC2_IP${NC}"
    else
        echo -e "${RED}Usage: $0 <EC2_IP>${NC}"
        echo ""
        echo "Or run 'terraform output instance_public_ip' in the terraform directory"
        exit 1
    fi
else
    EC2_IP=$1
fi

echo ""
echo -e "${BLUE}=========================================="
echo "  Deploying Moni Application to K3s"
echo -e "==========================================${NC}"
echo ""

# Check if kubeconfig exists
KUBECONFIG_PATH="$TERRAFORM_DIR/kubeconfig"
if [ ! -f "$KUBECONFIG_PATH" ]; then
    echo -e "${RED}ERROR: kubeconfig not found at $KUBECONFIG_PATH${NC}"
    echo "Make sure you've run 'terraform apply' first"
    exit 1
fi

# Set KUBECONFIG
export KUBECONFIG="$KUBECONFIG_PATH"

# Verify connection to cluster
echo -e "${YELLOW}→ Verifying connection to K3s cluster...${NC}"
if ! kubectl get nodes > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Cannot connect to K3s cluster${NC}"
    echo "Make sure the EC2 instance is running and the kubeconfig is correct"
    exit 1
fi
echo -e "${GREEN}✓ Connected to K3s cluster${NC}"
kubectl get nodes
echo ""

# Apply the manifests
echo -e "${YELLOW}→ Applying Kubernetes manifests...${NC}"
kubectl apply -f "$MANIFESTS_DIR/moni-app.yaml"
echo ""

# Wait for deployments
echo -e "${YELLOW}→ Waiting for deployments to be ready...${NC}"
echo "  (This may take 2-5 minutes for first deployment)"
echo ""

echo "  Waiting for database..."
kubectl wait --for=condition=available deployment/moni-db -n moni --timeout=180s || {
    echo -e "${YELLOW}  Database still starting, checking pods...${NC}"
    kubectl get pods -l app=moni-db -n moni
}

echo "  Waiting for backend..."
kubectl wait --for=condition=available deployment/moni-be -n moni --timeout=300s || {
    echo -e "${YELLOW}  Backend still starting, checking pods...${NC}"
    kubectl get pods -l app=moni-be -n moni
}

echo "  Waiting for frontend..."
kubectl wait --for=condition=available deployment/moni-fe -n moni --timeout=180s || {
    echo -e "${YELLOW}  Frontend still starting, checking pods...${NC}"
    kubectl get pods -l app=moni-fe -n moni
}

echo ""

# Show deployment status
echo -e "${BLUE}=========================================="
echo "  Deployment Status"
echo -e "==========================================${NC}"
echo ""
echo "Pods:"
kubectl get pods -n moni -o wide
echo ""
echo "Services:"
kubectl get svc -n moni
echo ""

# Show access information
echo -e "${GREEN}=========================================="
echo "  ACCESS INFORMATION"
echo -e "==========================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://$EC2_IP:30081${NC}"
echo -e "Backend:  ${GREEN}http://$EC2_IP:30080${NC}"
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Useful commands:"
echo "  kubectl get pods -n moni          # Check pod status"
echo "  kubectl logs -l app=moni-be -n moni  # View backend logs"
echo "  kubectl logs -l app=moni-fe -n moni  # View frontend logs"
echo "  kubectl logs -l app=moni-db -n moni  # View database logs"
