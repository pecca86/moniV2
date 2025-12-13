#!/bin/bash
# View logs for Moni application components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COMPONENT=${1:-all}
FOLLOW=${2:-}

show_usage() {
    echo "Usage: $0 [component] [--follow|-f]"
    echo ""
    echo "Components:"
    echo "  be, backend    - Backend (Spring Boot) logs"
    echo "  fe, frontend   - Frontend (Nginx) logs"
    echo "  db, database   - PostgreSQL logs"
    echo "  all            - All components (default)"
    echo ""
    echo "Options:"
    echo "  --follow, -f   - Follow logs in real-time"
    echo ""
    echo "Examples:"
    echo "  $0 be          - Show backend logs"
    echo "  $0 be -f       - Follow backend logs"
    echo "  $0 all         - Show all logs"
}

# Check if follow flag is set
if [[ "$COMPONENT" == "-f" ]] || [[ "$COMPONENT" == "--follow" ]]; then
    FOLLOW="-f"
    COMPONENT="all"
fi

if [[ "$2" == "-f" ]] || [[ "$2" == "--follow" ]]; then
    FOLLOW="-f"
fi

# Check if kubectl can connect
if ! kubectl cluster-info &> /dev/null 2>&1; then
    echo -e "${RED}Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi

# Check if moni namespace exists
if ! kubectl get namespace moni &> /dev/null 2>&1; then
    echo -e "${RED}Namespace 'moni' does not exist${NC}"
    echo "Deploy the application first: ./scripts/deploy.sh"
    exit 1
fi

case $COMPONENT in
    be|backend)
        echo -e "${BLUE}→ Backend Logs${NC}"
        echo ""
        kubectl logs deployment/moni-be -n moni $FOLLOW
        ;;
    fe|frontend)
        echo -e "${BLUE}→ Frontend Logs${NC}"
        echo ""
        kubectl logs deployment/moni-fe -n moni $FOLLOW
        ;;
    db|database)
        echo -e "${BLUE}→ Database Logs${NC}"
        echo ""
        kubectl logs deployment/moni-db -n moni $FOLLOW
        ;;
    all)
        echo -e "${BLUE}→ Database Logs${NC}"
        echo ""
        kubectl logs deployment/moni-db -n moni --tail=20 || true
        echo ""
        echo -e "${BLUE}→ Backend Logs${NC}"
        echo ""
        kubectl logs deployment/moni-be -n moni --tail=50 || true
        echo ""
        echo -e "${BLUE}→ Frontend Logs${NC}"
        echo ""
        kubectl logs deployment/moni-fe -n moni --tail=20 || true
        echo ""
        echo -e "${YELLOW}Tip: Use '$0 [be|fe|db] -f' to follow specific logs${NC}"
        ;;
    -h|--help|help)
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown component: $COMPONENT${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac
