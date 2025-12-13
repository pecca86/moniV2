#!/bin/bash
# Build Docker images and load them into the K3d cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../.."

CLUSTER_NAME="moni-local"
BE_IMAGE="moni-be:local"
FE_IMAGE="moni-fe:local"

# Parse arguments
BUILD_BE=true
BUILD_FE=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            BUILD_FE=false
            shift
            ;;
        --frontend-only)
            BUILD_BE=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--backend-only | --frontend-only]"
            exit 1
            ;;
    esac
done

echo ""
echo -e "${BLUE}=========================================="
echo "  Building and Loading Docker Images"
echo -e "==========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Check if cluster exists
if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo -e "${RED}Error: Cluster '$CLUSTER_NAME' does not exist${NC}"
    echo "Run ./scripts/cluster-create.sh first"
    exit 1
fi

# Build Backend
if [ "$BUILD_BE" = true ]; then
    echo -e "${YELLOW}→ Building backend image...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Option 1: Use Dockerfile.local (full build inside Docker - slower but no local Java needed)
    # Option 2: Build JAR locally first (faster iteration)
    
    if [ "${USE_DOCKER_BUILD:-false}" = "true" ]; then
        # Full Docker build (no local Maven needed)
        echo "  Building with Dockerfile.local (full Docker build)..."
        docker build -t "$BE_IMAGE" -f Dockerfile.local .
    else
        # Build JAR locally first, then create Docker image
        echo "  Building Spring Boot application locally..."
        
        if [ -f "./mvnw" ]; then
            ./mvnw clean package -DskipTests -q
        elif command -v mvn &> /dev/null; then
            mvn clean package -DskipTests -q
        else
            echo -e "${YELLOW}  Maven not found locally, using full Docker build...${NC}"
            docker build -t "$BE_IMAGE" -f Dockerfile.local .
            echo -e "${GREEN}✓ Backend image built: $BE_IMAGE${NC}"
            # Skip the rest of backend build
            BUILD_BE_DONE=true
        fi
        
        if [ "${BUILD_BE_DONE:-false}" != "true" ]; then
            # Copy JAR to expected location and build
            echo "  Building Docker image..."
            cp target/moni-0.0.1-SNAPSHOT.jar moni-backend.jar
            docker build -t "$BE_IMAGE" -f Dockerfile .
            rm moni-backend.jar
        fi
    fi
    
    echo -e "${GREEN}✓ Backend image built: $BE_IMAGE${NC}"
fi

# Build Frontend
if [ "$BUILD_FE" = true ]; then
    echo ""
    echo -e "${YELLOW}→ Building frontend image...${NC}"
    
    cd "$PROJECT_ROOT/FE/moni-fe"
    
    # Build Docker image
    docker build -t "$FE_IMAGE" .
    
    echo -e "${GREEN}✓ Frontend image built: $FE_IMAGE${NC}"
fi

# Load images into K3d cluster
echo ""
echo -e "${YELLOW}→ Loading images into K3d cluster...${NC}"

if [ "$BUILD_BE" = true ]; then
    echo "  Loading backend image..."
    k3d image import "$BE_IMAGE" -c "$CLUSTER_NAME"
    echo -e "${GREEN}✓ Backend image loaded${NC}"
fi

if [ "$BUILD_FE" = true ]; then
    echo "  Loading frontend image..."
    k3d image import "$FE_IMAGE" -c "$CLUSTER_NAME"
    echo -e "${GREEN}✓ Frontend image loaded${NC}"
fi

echo ""
echo -e "${BLUE}=========================================="
echo "  Images Built and Loaded Successfully!"
echo -e "==========================================${NC}"
echo ""
echo "Images in cluster:"
if [ "$BUILD_BE" = true ]; then
    echo "  - $BE_IMAGE"
fi
if [ "$BUILD_FE" = true ]; then
    echo "  - $FE_IMAGE"
fi
echo ""
echo "Next step:"
echo "  Deploy the app: ./scripts/deploy.sh"
echo ""
