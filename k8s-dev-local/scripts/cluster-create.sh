#!/bin/bash
# Create a local K3d cluster for Moni development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/../k3d-config.yaml"

CLUSTER_NAME="moni-local"
REGISTRY_NAME="moni-registry"
REGISTRY_PORT="5050"

echo ""
echo -e "${BLUE}=========================================="
echo "  Creating Local K3d Cluster"
echo -e "==========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker Desktop"
    exit 1
fi

# Check if k3d is installed
if ! command -v k3d &> /dev/null; then
    echo -e "${RED}Error: k3d is not installed${NC}"
    echo "Run ./scripts/setup.sh first"
    exit 1
fi

# Check if cluster already exists
if k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo -e "${YELLOW}⚠ Cluster '$CLUSTER_NAME' already exists${NC}"
    read -p "Do you want to delete and recreate it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}→ Deleting existing cluster...${NC}"
        k3d cluster delete "$CLUSTER_NAME"
    else
        echo "Keeping existing cluster"
        exit 0
    fi
fi

# Create the cluster
echo -e "${YELLOW}→ Creating K3d cluster '$CLUSTER_NAME'...${NC}"
if [ -f "$CONFIG_FILE" ]; then
    k3d cluster create --config "$CONFIG_FILE"
else
    # Fallback if config file doesn't exist
    k3d cluster create "$CLUSTER_NAME" \
        --servers 1 \
        --port "8080:80@loadbalancer" \
        --port "8081:8081@loadbalancer" \
        --port "30000-30100:30000-30100@server:0" \
        --registry-create "${REGISTRY_NAME}:0.0.0.0:${REGISTRY_PORT}" \
        --k3s-arg "--disable=traefik@server:0" \
        --k3s-arg "--disable=servicelb@server:0"
fi

echo ""
echo -e "${YELLOW}→ Waiting for cluster to be ready...${NC}"
sleep 5

# Verify cluster is running
if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✓ Cluster is ready!${NC}"
else
    echo -e "${RED}Error: Cluster failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}→ Cluster information:${NC}"
kubectl cluster-info
echo ""

echo -e "${YELLOW}→ Nodes:${NC}"
kubectl get nodes
echo ""

# Create the moni namespace
echo -e "${YELLOW}→ Creating 'moni' namespace...${NC}"
kubectl create namespace moni --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace 'moni' created${NC}"

echo ""
echo -e "${BLUE}=========================================="
echo "  Cluster Created Successfully!"
echo -e "==========================================${NC}"
echo ""
echo "Cluster Details:"
echo "  Name:          $CLUSTER_NAME"
echo "  Registry:      localhost:$REGISTRY_PORT"
echo "  Frontend Port: localhost:8080"
echo "  Backend Port:  localhost:8081"
echo ""
echo "Next steps:"
echo "  1. Build and load images: ./scripts/build-and-load.sh"
echo "  2. Deploy the app:        ./scripts/deploy.sh"
echo ""
