#!/bin/bash
# Show status of the local K3d cluster and Moni application

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
echo "  K3d Cluster and Moni Status"
echo -e "==========================================${NC}"
echo ""

# Check k3d cluster status
echo -e "${YELLOW}→ K3d Clusters:${NC}"
if command -v k3d &> /dev/null; then
    k3d cluster list
else
    echo "k3d not installed"
fi
echo ""

# Check if kubectl can connect
if ! kubectl cluster-info &> /dev/null 2>&1; then
    echo -e "${RED}Cannot connect to Kubernetes cluster${NC}"
    echo "Make sure the cluster is running: ./scripts/cluster-create.sh"
    exit 1
fi

# Current context
echo -e "${YELLOW}→ Kubernetes Context:${NC}"
kubectl config current-context
echo ""

# Nodes
echo -e "${YELLOW}→ Nodes:${NC}"
kubectl get nodes -o wide
echo ""

# Namespaces
echo -e "${YELLOW}→ Namespaces:${NC}"
kubectl get namespaces
echo ""

# Check if moni namespace exists
if ! kubectl get namespace moni &> /dev/null 2>&1; then
    echo -e "${YELLOW}Namespace 'moni' does not exist${NC}"
    echo "Deploy the application first: ./scripts/deploy.sh"
    exit 0
fi

# Pods in moni namespace
echo -e "${YELLOW}→ Pods (moni namespace):${NC}"
kubectl get pods -n moni -o wide
echo ""

# Deployments
echo -e "${YELLOW}→ Deployments:${NC}"
kubectl get deployments -n moni
echo ""

# Services
echo -e "${YELLOW}→ Services:${NC}"
kubectl get svc -n moni
echo ""

# PersistentVolumeClaims
echo -e "${YELLOW}→ Persistent Volume Claims:${NC}"
kubectl get pvc -n moni
echo ""

# Recent events (last 10)
echo -e "${YELLOW}→ Recent Events (last 10):${NC}"
kubectl get events -n moni --sort-by='.lastTimestamp' | tail -10
echo ""

# Resource usage (if metrics-server is available)
echo -e "${YELLOW}→ Resource Usage:${NC}"
if kubectl top pods -n moni &> /dev/null 2>&1; then
    kubectl top pods -n moni
else
    echo "Metrics not available (metrics-server not installed)"
fi
echo ""

# Application access info
echo -e "${GREEN}=========================================="
echo "  Application Access"
echo -e "==========================================${NC}"
echo ""
echo "  Frontend:    http://localhost:8080"
echo "  Backend API: http://localhost:8081"
echo ""
