#!/bin/bash

# Automated deployment script for Moni EKS infrastructure
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists terraform; then
        missing_tools+=("terraform")
    fi
    
    if ! command_exists aws; then
        missing_tools+=("aws-cli")
    fi
    
    if ! command_exists kubectl; then
        missing_tools+=("kubectl")
    fi
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_error "Please install missing tools and try again"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS credentials not configured. Run 'aws configure' first"
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Initialize Terraform
init_terraform() {
    print_status "Initializing Terraform..."
    
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found, copying example file"
        cp terraform.tfvars.example terraform.tfvars
        print_warning "Please edit terraform.tfvars and run this script again"
        exit 1
    fi
    
    terraform init
    print_success "Terraform initialized"
}

# Deploy infrastructure
deploy_infrastructure() {
    print_status "Planning Terraform deployment..."
    terraform plan -out=tfplan
    
    echo ""
    print_warning "Review the plan above. Continue with deployment? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled"
        exit 0
    fi
    
    print_status "Deploying infrastructure (this may take 15-20 minutes)..."
    terraform apply tfplan
    rm -f tfplan
    
    print_success "Infrastructure deployed successfully"
}

# Configure kubectl
configure_kubectl() {
    print_status "Configuring kubectl..."
    
    local cluster_name=$(terraform output -raw cluster_name)
    local aws_region=$(terraform output -raw aws_region 2>/dev/null || echo "us-west-2")
    
    aws eks update-kubeconfig --region "$aws_region" --name "$cluster_name"
    
    print_status "Waiting for cluster to be ready..."
    kubectl wait --for=condition=Ready nodes --all --timeout=300s
    
    print_success "kubectl configured and cluster is ready"
}

# Setup ECR and build images
setup_ecr() {
    print_status "Setting up ECR repositories..."
    
    # Get ECR URLs from Terraform output
    local backend_repo=$(terraform output -raw ecr_backend_repository_url)
    local frontend_repo=$(terraform output -raw ecr_frontend_repository_url)
    
    if [ "$backend_repo" == "null" ] || [ "$frontend_repo" == "null" ]; then
        print_warning "ECR repositories not created. Skipping image build."
        return
    fi
    
    print_status "ECR Backend Repository: $backend_repo"
    print_status "ECR Frontend Repository: $frontend_repo"
    
    # Login to ECR
    print_status "Logging into ECR..."
    aws ecr get-login-password --region $(terraform output -raw aws_region 2>/dev/null || echo "us-west-2") | \
        docker login --username AWS --password-stdin $(echo "$backend_repo" | cut -d'/' -f1)
    
    # Ask if user wants to build and push images
    echo ""
    print_warning "Build and push Docker images to ECR? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        build_and_push_images "$backend_repo" "$frontend_repo"
    else
        print_status "Skipping image build. You can build them later using:"
        echo "  terraform output docker_build_commands"
    fi
}

# Build and push Docker images
build_and_push_images() {
    local backend_repo=$1
    local frontend_repo=$2
    
    print_status "Building and pushing backend image..."
    
    # Check if Dockerfile exists
    if [ ! -f "../Dockerfile" ]; then
        print_error "Dockerfile not found in parent directory"
        return 1
    fi
    
    cd ..
    
    # Build backend
    docker build -t moni-be-slim:latest -f Dockerfile .
    docker tag moni-be-slim:latest "$backend_repo:latest"
    docker push "$backend_repo:latest"
    
    # Build frontend
    if [ -d "FE/moni-fe" ]; then
        print_status "Building and pushing frontend image..."
        cd FE/moni-fe
        docker build -t moni-fe:latest .
        docker tag moni-fe:latest "$frontend_repo:latest"
        docker push "$frontend_repo:latest"
        cd ../..
    else
        print_warning "Frontend directory FE/moni-fe not found, skipping frontend build"
    fi
    
    cd terraform
    print_success "Images built and pushed to ECR"
}

# Update Kubernetes manifests with ECR URLs
update_k8s_manifests() {
    local backend_repo=$(terraform output -raw ecr_backend_repository_url)
    local frontend_repo=$(terraform output -raw ecr_frontend_repository_url)
    
    if [ "$backend_repo" == "null" ] || [ "$frontend_repo" == "null" ]; then
        print_warning "ECR repositories not available. Please manually update image URLs in Kubernetes manifests."
        return
    fi
    
    print_status "Updating Kubernetes manifests with ECR URLs..."
    
    # Update Moni-aws.yaml
    if [ -f "../base/Moni-aws.yaml" ]; then
        sed -i.bak "s|YOUR_ACCOUNT\.dkr\.ecr\.YOUR_REGION\.amazonaws\.com/moni-be:latest|$backend_repo:latest|g" ../base/Moni-aws.yaml
        sed -i.bak "s|YOUR_ACCOUNT\.dkr\.ecr\.YOUR_REGION\.amazonaws\.com/moni-fe:latest|$frontend_repo:latest|g" ../base/Moni-aws.yaml
        rm -f ../base/Moni-aws.yaml.bak
        print_success "Updated ../base/Moni-aws.yaml with ECR URLs"
    fi
}

# Deploy application to Kubernetes
deploy_application() {
    echo ""
    print_warning "Deploy Moni application to Kubernetes? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_status "Skipping application deployment"
        return
    fi
    
    print_status "Deploying Moni application..."
    
    # Check if manifest exists
    if [ ! -f "../base/Moni-aws.yaml" ]; then
        print_error "Kubernetes manifest ../base/Moni-aws.yaml not found"
        return 1
    fi
    
    kubectl apply -f ../base/Moni-aws.yaml
    
    print_status "Waiting for pods to be ready..."
    kubectl wait --for=condition=Ready pod -l app=moni-fe -n moni --timeout=300s
    kubectl wait --for=condition=Ready pod -l app=moni-be -n moni --timeout=300s
    
    print_success "Application deployed successfully"
}

# Show access information
show_access_info() {
    print_status "Deployment Summary:"
    echo ""
    
    # Cluster info
    echo "🏗️  EKS Cluster:"
    echo "   Name: $(terraform output -raw cluster_name)"
    echo "   Endpoint: $(terraform output -raw cluster_endpoint)"
    echo ""
    
    # ECR repositories
    local backend_repo=$(terraform output -raw ecr_backend_repository_url)
    local frontend_repo=$(terraform output -raw ecr_frontend_repository_url)
    
    if [ "$backend_repo" != "null" ] && [ "$frontend_repo" != "null" ]; then
        echo "🐳 ECR Repositories:"
        echo "   Backend:  $backend_repo"
        echo "   Frontend: $frontend_repo"
        echo ""
    fi
    
    # Application access
    echo "🌐 Application Access:"
    
    # Check for LoadBalancer service
    local lb_ip=$(kubectl get svc moni-fe -n moni -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
    if [ -n "$lb_ip" ]; then
        echo "   Frontend: http://$lb_ip"
    else
        echo "   LoadBalancer IP not yet assigned. Check with:"
        echo "   kubectl get svc moni-fe -n moni"
    fi
    
    # Check for Ingress
    local ingress_host=$(kubectl get ingress -n moni -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
    if [ -n "$ingress_host" ]; then
        echo "   Ingress: http://$ingress_host"
    fi
    
    echo ""
    echo "📋 Useful Commands:"
    echo "   Check pods: kubectl get pods -n moni"
    echo "   View logs: kubectl logs -f deployment/moni-be -n moni"
    echo "   Port forward (if needed): kubectl port-forward svc/moni-fe 8080:80 -n moni"
    echo ""
    
    print_success "🎉 Deployment completed successfully!"
}

# Cleanup function
cleanup() {
    print_warning "Cleaning up Terraform plan file..."
    rm -f tfplan
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    echo "🚀 Moni EKS Deployment Script"
    echo "================================="
    echo ""
    
    check_prerequisites
    init_terraform
    deploy_infrastructure
    configure_kubectl
    setup_ecr
    update_k8s_manifests
    deploy_application
    show_access_info
}

# Run main function
main "$@"