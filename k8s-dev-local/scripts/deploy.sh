#!/bin/bash
# Deploy Moni application to local K3d cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFESTS_DIR="$SCRIPT_DIR/../manifests"

CLUSTER_NAME="moni-local"

echo ""
echo -e "${BLUE}=========================================="
echo "  Deploying Moni to Local K3d Cluster"
echo -e "==========================================${NC}"
echo ""

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check if cluster exists and is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    echo "Make sure the K3d cluster is running: ./scripts/cluster-create.sh"
    exit 1
fi

# Verify we're connected to the right cluster
CURRENT_CONTEXT=$(kubectl config current-context)
if [[ "$CURRENT_CONTEXT" != *"$CLUSTER_NAME"* ]]; then
    echo -e "${YELLOW}⚠ Current context is '$CURRENT_CONTEXT'${NC}"
    echo -e "${YELLOW}  Expected context containing '$CLUSTER_NAME'${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Connected to cluster: $CURRENT_CONTEXT${NC}"
echo ""

# Apply manifests
echo -e "${YELLOW}→ Applying Kubernetes manifests...${NC}"
kubectl apply -f "$MANIFESTS_DIR/moni-app-local.yaml"
echo ""

# Wait for deployments
echo -e "${YELLOW}→ Waiting for deployments to be ready...${NC}"
echo "  (This may take 1-3 minutes for first deployment)"
echo ""

echo "  Waiting for database..."
kubectl wait --for=condition=available deployment/moni-db -n moni --timeout=180s || {
    echo -e "${YELLOW}  Database still starting...${NC}"
    kubectl get pods -l app=moni-db -n moni
}

echo "  Waiting for backend..."
kubectl wait --for=condition=available deployment/moni-be -n moni --timeout=300s || {
    echo -e "${YELLOW}  Backend still starting...${NC}"
    kubectl get pods -l app=moni-be -n moni
}

echo "  Waiting for frontend..."
kubectl wait --for=condition=available deployment/moni-fe -n moni --timeout=180s || {
    echo -e "${YELLOW}  Frontend still starting...${NC}"
    kubectl get pods -l app=moni-fe -n moni
}

echo ""
echo -e "${BLUE}=========================================="
echo "  Deployment Complete!"
echo -e "==========================================${NC}"
echo ""

# Show status
echo "Pods:"
kubectl get pods -n moni -o wide
echo ""

echo "Services:"
kubectl get svc -n moni
echo ""

echo -e "${GREEN}=========================================="
echo "  Application URLs"
echo -e "==========================================${NC}"
echo ""
echo "  Frontend:    http://localhost:8080"
echo "  Backend API: http://localhost:8081"
echo ""
echo "Useful commands:"
echo "  Check status:  ./scripts/status.sh"
echo "  View logs:     ./scripts/logs.sh [be|fe|db]"
echo "  Watch pods:    kubectl get pods -n moni -w"
echo ""
