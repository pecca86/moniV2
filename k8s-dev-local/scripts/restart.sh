#!/bin/bash
# Quick restart of the application (rebuild and redeploy)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo -e "${BLUE}=========================================="
echo "  Quick Restart - Rebuild and Redeploy"
echo -e "==========================================${NC}"
echo ""

# Parse arguments
COMPONENT=${1:-all}

case $COMPONENT in
    be|backend)
        echo -e "${YELLOW}→ Rebuilding backend only...${NC}"
        "$SCRIPT_DIR/build-and-load.sh" --backend-only
        echo ""
        echo -e "${YELLOW}→ Restarting backend deployment...${NC}"
        kubectl rollout restart deployment/moni-be -n moni
        kubectl rollout status deployment/moni-be -n moni --timeout=120s
        ;;
    fe|frontend)
        echo -e "${YELLOW}→ Rebuilding frontend only...${NC}"
        "$SCRIPT_DIR/build-and-load.sh" --frontend-only
        echo ""
        echo -e "${YELLOW}→ Restarting frontend deployment...${NC}"
        kubectl rollout restart deployment/moni-fe -n moni
        kubectl rollout status deployment/moni-fe -n moni --timeout=60s
        ;;
    all)
        echo -e "${YELLOW}→ Rebuilding all images...${NC}"
        "$SCRIPT_DIR/build-and-load.sh"
        echo ""
        echo -e "${YELLOW}→ Restarting all deployments...${NC}"
        kubectl rollout restart deployment/moni-be -n moni
        kubectl rollout restart deployment/moni-fe -n moni
        echo "  Waiting for backend..."
        kubectl rollout status deployment/moni-be -n moni --timeout=120s
        echo "  Waiting for frontend..."
        kubectl rollout status deployment/moni-fe -n moni --timeout=60s
        ;;
    db|database)
        echo -e "${YELLOW}→ Restarting database...${NC}"
        echo -e "${RED}⚠ Warning: This will cause temporary data unavailability${NC}"
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kubectl rollout restart deployment/moni-db -n moni
            kubectl rollout status deployment/moni-db -n moni --timeout=120s
        fi
        ;;
    *)
        echo "Usage: $0 [component]"
        echo ""
        echo "Components:"
        echo "  be, backend   - Rebuild and restart backend"
        echo "  fe, frontend  - Rebuild and restart frontend"
        echo "  db, database  - Restart database (no rebuild)"
        echo "  all           - Rebuild and restart everything (default)"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Restart complete!${NC}"
echo ""
