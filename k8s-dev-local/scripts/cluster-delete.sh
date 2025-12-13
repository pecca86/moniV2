#!/bin/bash
# Delete the local K3d cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CLUSTER_NAME="moni-local"

echo ""
echo -e "${BLUE}=========================================="
echo "  Deleting K3d Cluster"
echo -e "==========================================${NC}"
echo ""

# Check if k3d is installed
if ! command -v k3d &> /dev/null; then
    echo -e "${RED}Error: k3d is not installed${NC}"
    exit 1
fi

# Check if cluster exists
if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo -e "${YELLOW}Cluster '$CLUSTER_NAME' does not exist${NC}"
    exit 0
fi

# Confirm deletion
read -p "Are you sure you want to delete cluster '$CLUSTER_NAME'? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Delete the cluster
echo -e "${YELLOW}→ Deleting cluster '$CLUSTER_NAME'...${NC}"
k3d cluster delete "$CLUSTER_NAME"

echo ""
echo -e "${GREEN}✓ Cluster deleted successfully${NC}"
echo ""
echo "Note: Docker images are still available locally."
echo "To also remove them, run:"
echo "  docker rmi moni-be:local moni-fe:local"
echo ""
