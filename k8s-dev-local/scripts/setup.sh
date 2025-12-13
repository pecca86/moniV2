#!/bin/bash
# Setup script for local Kubernetes development
# Installs k3d, kubectl, and other required tools

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}=========================================="
echo "  Local Kubernetes Development Setup"
echo -e "==========================================${NC}"
echo ""

# Check OS
OS=$(uname -s)
if [ "$OS" != "Darwin" ] && [ "$OS" != "Linux" ]; then
    echo -e "${RED}Error: This script only supports macOS and Linux${NC}"
    exit 1
fi

# Check if Docker is installed and running
echo -e "${YELLOW}→ Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker Desktop"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed and running${NC}"

# Install k3d
echo ""
echo -e "${YELLOW}→ Installing k3d...${NC}"
if command -v k3d &> /dev/null; then
    K3D_VERSION=$(k3d version | head -1)
    echo -e "${GREEN}✓ k3d is already installed: $K3D_VERSION${NC}"
else
    if [ "$OS" = "Darwin" ]; then
        # macOS - use Homebrew
        if command -v brew &> /dev/null; then
            brew install k3d
        else
            # Use curl installer
            curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
        fi
    else
        # Linux - use curl installer
        curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
    fi
    echo -e "${GREEN}✓ k3d installed successfully${NC}"
fi

# Install kubectl
echo ""
echo -e "${YELLOW}→ Checking kubectl...${NC}"
if command -v kubectl &> /dev/null; then
    KUBECTL_VERSION=$(kubectl version --client -o json 2>/dev/null | grep -o '"gitVersion": "[^"]*"' | head -1 || echo "installed")
    echo -e "${GREEN}✓ kubectl is already installed: $KUBECTL_VERSION${NC}"
else
    if [ "$OS" = "Darwin" ]; then
        if command -v brew &> /dev/null; then
            brew install kubectl
        else
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
            chmod +x kubectl
            sudo mv kubectl /usr/local/bin/
        fi
    else
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/
    fi
    echo -e "${GREEN}✓ kubectl installed successfully${NC}"
fi

# Install k9s (optional but recommended)
echo ""
echo -e "${YELLOW}→ Checking k9s (optional Kubernetes UI)...${NC}"
if command -v k9s &> /dev/null; then
    echo -e "${GREEN}✓ k9s is already installed${NC}"
else
    echo -e "${YELLOW}  k9s is not installed. It's an optional but helpful Kubernetes UI.${NC}"
    if [ "$OS" = "Darwin" ] && command -v brew &> /dev/null; then
        read -p "  Would you like to install k9s? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            brew install k9s
            echo -e "${GREEN}✓ k9s installed successfully${NC}"
        fi
    else
        echo "  To install manually, visit: https://k9scli.io/topics/install/"
    fi
fi

echo ""
echo -e "${BLUE}=========================================="
echo "  Setup Complete!"
echo -e "==========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Create the cluster:    ./scripts/cluster-create.sh"
echo "  2. Build and load images: ./scripts/build-and-load.sh"
echo "  3. Deploy the app:        ./scripts/deploy.sh"
echo ""
