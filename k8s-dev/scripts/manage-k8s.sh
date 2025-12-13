#!/bin/bash
# Manage K3s cluster and Moni application
# Usage: ./manage-k8s.sh <command>

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

# Set KUBECONFIG
KUBECONFIG_PATH="$TERRAFORM_DIR/kubeconfig"
if [ -f "$KUBECONFIG_PATH" ]; then
    export KUBECONFIG="$KUBECONFIG_PATH"
else
    echo -e "${RED}ERROR: kubeconfig not found at $KUBECONFIG_PATH${NC}"
    echo "Make sure you've run 'terraform apply' first"
    exit 1
fi

# Get EC2 IP from kubeconfig
EC2_IP=$(grep "server:" "$KUBECONFIG_PATH" | sed 's/.*https:\/\/\([^:]*\).*/\1/')

show_help() {
    echo ""
    echo -e "${BLUE}K3s Cluster Management Script${NC}"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status      - Show cluster and application status"
    echo "  pods        - List all pods in moni namespace"
    echo "  logs        - Show logs for all components"
    echo "  logs-be     - Show backend logs (follow)"
    echo "  logs-fe     - Show frontend logs (follow)"
    echo "  logs-db     - Show database logs (follow)"
    echo "  restart     - Restart all deployments"
    echo "  restart-be  - Restart backend only"
    echo "  restart-fe  - Restart frontend only"
    echo "  restart-db  - Restart database only"
    echo "  scale       - Scale deployments (usage: scale <component> <replicas>)"
    echo "  shell-be    - Open shell in backend pod"
    echo "  shell-db    - Open psql in database pod"
    echo "  delete      - Delete application (keeps cluster)"
    echo "  deploy      - Deploy/update application"
    echo "  update      - Pull latest images and restart"
    echo "  events      - Show recent events"
    echo "  describe    - Describe all resources"
    echo "  help        - Show this help"
    echo ""
}

cmd_status() {
    echo -e "${BLUE}=========================================="
    echo "  K3s Cluster Status"
    echo -e "==========================================${NC}"
    echo ""
    echo -e "${YELLOW}Nodes:${NC}"
    kubectl get nodes
    echo ""
    echo -e "${YELLOW}Pods in moni namespace:${NC}"
    kubectl get pods -n moni -o wide
    echo ""
    echo -e "${YELLOW}Services:${NC}"
    kubectl get svc -n moni
    echo ""
    echo -e "${YELLOW}Persistent Volume Claims:${NC}"
    kubectl get pvc -n moni
    echo ""
    echo -e "${GREEN}Access URLs:${NC}"
    echo "  Frontend: http://$EC2_IP:30081"
    echo "  Backend:  http://$EC2_IP:30080"
    echo ""
}

cmd_pods() {
    kubectl get pods -n moni -o wide
}

cmd_logs() {
    echo -e "${YELLOW}=== Database Logs (last 20 lines) ===${NC}"
    kubectl logs -l app=moni-db -n moni --tail=20 2>/dev/null || echo "No database logs yet"
    echo ""
    echo -e "${YELLOW}=== Backend Logs (last 20 lines) ===${NC}"
    kubectl logs -l app=moni-be -n moni --tail=20 2>/dev/null || echo "No backend logs yet"
    echo ""
    echo -e "${YELLOW}=== Frontend Logs (last 20 lines) ===${NC}"
    kubectl logs -l app=moni-fe -n moni --tail=20 2>/dev/null || echo "No frontend logs yet"
}

cmd_logs_component() {
    component=$1
    echo -e "${YELLOW}Following logs for moni-$component...${NC}"
    echo "(Press Ctrl+C to exit)"
    kubectl logs -l app=moni-$component -n moni -f
}

cmd_restart() {
    echo -e "${YELLOW}Restarting all deployments...${NC}"
    kubectl rollout restart deployment/moni-db -n moni
    kubectl rollout restart deployment/moni-be -n moni
    kubectl rollout restart deployment/moni-fe -n moni
    echo -e "${GREEN}Restart initiated!${NC}"
    echo ""
    kubectl get pods -n moni
}

cmd_restart_component() {
    component=$1
    echo -e "${YELLOW}Restarting moni-$component...${NC}"
    kubectl rollout restart deployment/moni-$component -n moni
    kubectl rollout status deployment/moni-$component -n moni
}

cmd_scale() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: $0 scale <component> <replicas>"
        echo "Example: $0 scale be 3"
        exit 1
    fi
    component=$1
    replicas=$2
    echo -e "${YELLOW}Scaling moni-$component to $replicas replicas...${NC}"
    kubectl scale deployment/moni-$component --replicas=$replicas -n moni
    kubectl get pods -l app=moni-$component -n moni
}

cmd_shell_be() {
    POD=$(kubectl get pods -l app=moni-be -n moni -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    if [ -z "$POD" ]; then
        echo -e "${RED}No backend pod found${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Opening shell in $POD...${NC}"
    kubectl exec -it $POD -n moni -- /bin/sh
}

cmd_shell_db() {
    POD=$(kubectl get pods -l app=moni-db -n moni -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    if [ -z "$POD" ]; then
        echo -e "${RED}No database pod found${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Opening psql in $POD...${NC}"
    kubectl exec -it $POD -n moni -- psql -U postgres -d moni
}

cmd_delete() {
    echo -e "${RED}This will delete all Moni application resources!${NC}"
    read -p "Are you sure? (y/N) " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        kubectl delete -f "$MANIFESTS_DIR/moni-app.yaml"
        echo -e "${GREEN}Application deleted${NC}"
    else
        echo "Cancelled"
    fi
}

cmd_deploy() {
    "$SCRIPT_DIR/deploy-k8s.sh"
}

cmd_update() {
    echo -e "${YELLOW}Updating deployments with latest images...${NC}"
    
    # Restart to pull latest images (imagePullPolicy: Always)
    kubectl rollout restart deployment/moni-be -n moni
    kubectl rollout restart deployment/moni-fe -n moni
    
    echo "Waiting for rollout to complete..."
    kubectl rollout status deployment/moni-be -n moni
    kubectl rollout status deployment/moni-fe -n moni
    
    echo -e "${GREEN}Update complete!${NC}"
    kubectl get pods -n moni
}

cmd_events() {
    echo -e "${YELLOW}Recent events in moni namespace:${NC}"
    kubectl get events -n moni --sort-by='.lastTimestamp' | tail -30
}

cmd_describe() {
    echo -e "${YELLOW}=== Deployments ===${NC}"
    kubectl describe deployments -n moni
    echo ""
    echo -e "${YELLOW}=== Services ===${NC}"
    kubectl describe svc -n moni
    echo ""
    echo -e "${YELLOW}=== Pods ===${NC}"
    kubectl describe pods -n moni
}

# Main command handler
case "${1:-help}" in
    status)
        cmd_status
        ;;
    pods)
        cmd_pods
        ;;
    logs)
        cmd_logs
        ;;
    logs-be)
        cmd_logs_component "be"
        ;;
    logs-fe)
        cmd_logs_component "fe"
        ;;
    logs-db)
        cmd_logs_component "db"
        ;;
    restart)
        cmd_restart
        ;;
    restart-be)
        cmd_restart_component "be"
        ;;
    restart-fe)
        cmd_restart_component "fe"
        ;;
    restart-db)
        cmd_restart_component "db"
        ;;
    scale)
        cmd_scale "$2" "$3"
        ;;
    shell-be)
        cmd_shell_be
        ;;
    shell-db)
        cmd_shell_db
        ;;
    delete)
        cmd_delete
        ;;
    deploy)
        cmd_deploy
        ;;
    update)
        cmd_update
        ;;
    events)
        cmd_events
        ;;
    describe)
        cmd_describe
        ;;
    help|*)
        show_help
        ;;
esac
