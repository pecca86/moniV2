#!/bin/bash

# Automated deployment script for Moni K3s on EC2
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
    
    if ! command_exists ssh; then
        missing_tools+=("ssh")
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
        print_warning "Please edit terraform.tfvars with your settings and run this script again"
        echo ""
        echo "Important settings to configure:"
        echo "  - aws_region: Your preferred AWS region"
        echo "  - allowed_ssh_cidr: Your IP address for SSH access"
        echo "  - domain_name: Optional custom domain"
        echo "  - create_ecr_repos: true for private container registry"
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
    
    print_status "Deploying infrastructure (this may take 5-10 minutes)..."
    terraform apply tfplan
    rm -f tfplan
    
    print_success "Infrastructure deployed successfully"
}

# Wait for instance to be ready
wait_for_instance() {
    print_status "Waiting for EC2 instance and K3s to be ready..."
    
    local instance_ip=$(terraform output -raw instance_public_ip)
    local ssh_key=$(terraform output -raw ssh_command | grep -o '\-i [^ ]*' | cut -d' ' -f2)
    local max_attempts=30
    local attempt=0
    
    print_status "Instance IP: $instance_ip"
    print_status "SSH Key: $ssh_key"
    
    # Wait for SSH to be available
    while [ $attempt -lt $max_attempts ]; do
        if ssh -i "$ssh_key" -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
               ec2-user@"$instance_ip" "echo 'SSH is ready'" >/dev/null 2>&1; then
            break
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 10
    done
    echo ""
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Timeout waiting for SSH access"
        exit 1
    fi
    
    print_success "SSH access established"
    
    # Wait for K3s to be ready
    print_status "Waiting for K3s to be ready..."
    ssh -i "$ssh_key" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        ec2-user@"$instance_ip" "
        while ! sudo systemctl is-active --quiet k3s; do 
            echo 'Waiting for K3s...'
            sleep 5
        done
        echo 'K3s is ready!'
        kubectl get nodes
    "
    
    print_success "K3s cluster is ready"
}

# Deploy application
deploy_application() {
    echo ""
    print_warning "Deploy Moni application to K3s? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_status "Skipping application deployment"
        return
    fi
    
    print_status "Deploying Moni application..."
    
    local instance_ip=$(terraform output -raw instance_public_ip)
    local ssh_key=$(terraform output -raw ssh_command | grep -o '\-i [^ ]*' | cut -d' ' -f2)
    
    # Deploy the application
    ssh -i "$ssh_key" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        ec2-user@"$instance_ip" "./deploy-moni.sh"
    
    print_success "Application deployed successfully"
}

# Setup local kubectl (optional)
setup_kubectl() {
    if ! command_exists kubectl; then
        print_warning "kubectl not found locally. Skipping local kubeconfig setup."
        print_status "You can still manage the cluster by SSH'ing to the instance."
        return
    fi
    
    echo ""
    print_warning "Setup local kubectl access? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        return
    fi
    
    print_status "Setting up local kubectl access..."
    
    if [ -f "./kubeconfig" ]; then
        export KUBECONFIG="$(pwd)/kubeconfig"
        
        # Test connection
        if kubectl get nodes >/dev/null 2>&1; then
            print_success "Local kubectl configured successfully"
            echo "Run: export KUBECONFIG=$(pwd)/kubeconfig"
        else
            print_warning "Kubeconfig file exists but connection failed"
            print_status "Try connecting via SSH instead"
        fi
    else
        print_warning "Kubeconfig file not found. This may be expected if deployment just completed."
    fi
}

# Show access information and next steps
show_access_info() {
    print_status "Deployment Summary:"
    echo ""
    
    # Instance info
    echo "🖥️  EC2 Instance:"
    echo "   IP Address: $(terraform output -raw instance_public_ip)"
    echo "   Instance ID: $(terraform output -raw instance_id)"
    echo "   Instance Type: $(terraform output -json instance_specs | jq -r '.instance_type')"
    echo ""
    
    # Application URLs
    echo "🌐 Application Access:"
    local app_urls=$(terraform output -json application_urls)
    echo "   Frontend: $(echo "$app_urls" | jq -r '.frontend_nodeport')"
    echo "   Backend:  $(echo "$app_urls" | jq -r '.backend_nodeport')"
    
    local domain_url=$(echo "$app_urls" | jq -r '.domain_url // empty')
    if [ -n "$domain_url" ]; then
        echo "   Domain:   $domain_url"
    fi
    echo ""
    
    # ECR repositories (if created)
    local ecr_repos=$(terraform output -json ecr_repositories)
    if [ "$ecr_repos" != "null" ]; then
        echo "🐳 ECR Repositories:"
        echo "   Backend:  $(echo "$ecr_repos" | jq -r '.backend')"
        echo "   Frontend: $(echo "$ecr_repos" | jq -r '.frontend')"
        echo ""
    fi
    
    # Cost estimate
    echo "💰 Estimated Monthly Cost:"
    local cost_info=$(terraform output -json cost_estimate)
    echo "   $(echo "$cost_info" | jq -r '.estimated_total')"
    echo "   $(echo "$cost_info" | jq -r '.free_tier_note')"
    echo ""
    
    # Useful commands
    echo "📋 Useful Commands:"
    echo "   SSH to instance:"
    echo "     $(terraform output -raw ssh_command)"
    echo ""
    echo "   Check application status:"
    echo "     ssh ... 'k3s-status'"
    echo ""
    echo "   View application logs:"
    echo "     ssh ... 'moni-logs'"
    echo ""
    echo "   Use kubectl locally (if configured):"
    echo "     export KUBECONFIG=$(pwd)/kubeconfig"
    echo "     kubectl get pods -n moni"
    echo ""
    
    # Next steps
    echo "🎯 Next Steps:"
    local next_steps=$(terraform output -json next_steps)
    echo "$next_steps" | jq -r '.[]' | sed 's/^/   /'
    echo ""
    
    print_success "🎉 Deployment completed successfully!"
    
    # Test application access
    local frontend_url=$(echo "$app_urls" | jq -r '.frontend_nodeport')
    echo ""
    print_status "Testing application access..."
    if curl -s --connect-timeout 10 "$frontend_url" >/dev/null; then
        print_success "✅ Application is accessible at: $frontend_url"
    else
        print_warning "⚠️  Application may still be starting up. Try accessing it in a few minutes."
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f tfplan
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    echo "🚀 Moni K3s on EC2 Deployment Script"
    echo "====================================="
    echo ""
    echo "This will deploy your Moni application using K3s on a single EC2 instance."
    echo "Cost: ~$5/month (or FREE for 12 months with AWS Free Tier)"
    echo ""
    
    check_prerequisites
    init_terraform
    deploy_infrastructure
    wait_for_instance
    deploy_application
    setup_kubectl
    show_access_info
}

# Run main function
main "$@"