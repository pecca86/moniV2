#!/bin/bash
# Setup local kubectl to connect to K3s cluster
# Usage: source ./setup-local-kubectl.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"

KUBECONFIG_PATH="$TERRAFORM_DIR/kubeconfig"

echo ""
echo -e "${BLUE}=========================================="
echo "  Local kubectl Setup for K3s"
echo -e "==========================================${NC}"
echo ""

# Check if kubeconfig exists
if [ ! -f "$KUBECONFIG_PATH" ]; then
    echo -e "${RED}ERROR: kubeconfig not found at $KUBECONFIG_PATH${NC}"
    echo ""
    echo "Please run 'terraform apply' first in the terraform directory"
    exit 1
fi

echo -e "${GREEN}✓ Found kubeconfig at: $KUBECONFIG_PATH${NC}"

# Export KUBECONFIG
export KUBECONFIG="$KUBECONFIG_PATH"

echo ""
echo -e "${YELLOW}KUBECONFIG has been set for this session.${NC}"
echo ""

# Test connection
echo "Testing connection to cluster..."
if kubectl get nodes > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Successfully connected to K3s cluster!${NC}"
    echo ""
    echo "Cluster nodes:"
    kubectl get nodes
    echo ""
    
    # Get EC2 IP
    EC2_IP=$(grep "server:" "$KUBECONFIG_PATH" | sed 's/.*https:\/\/\([^:]*\).*/\1/')
    
    echo -e "${BLUE}=========================================="
    echo "  Ready to use kubectl!"
    echo -e "==========================================${NC}"
    echo ""
    echo "Example commands:"
    echo "  kubectl get nodes"
    echo "  kubectl get pods -n moni"
    echo "  kubectl get svc -n moni"
    echo "  kubectl logs -l app=moni-be -n moni"
    echo ""
    echo "Application URLs:"
    echo "  Frontend: http://$EC2_IP:30081"
    echo "  Backend:  http://$EC2_IP:30080"
else
    echo -e "${RED}✗ Cannot connect to cluster${NC}"
    echo ""
    echo "Possible issues:"
    echo "  1. EC2 instance is not running"
    echo "  2. Security group doesn't allow port 6443"
    echo "  3. K3s is not running on the instance"
    echo ""
    echo "Try SSHing to the instance and checking K3s status:"
    echo "  ssh -i $TERRAFORM_DIR/moni-dev-k3s-key.pem ec2-user@<EC2_IP>"
    echo "  sudo systemctl status k3s"
    exit 1
fi

echo ""
echo -e "${YELLOW}Note: Run 'source $0' to set KUBECONFIG in your current shell${NC}"
echo ""
echo "To make this permanent, add to your ~/.bashrc or ~/.zshrc:"
echo "  export KUBECONFIG=$KUBECONFIG_PATH"
