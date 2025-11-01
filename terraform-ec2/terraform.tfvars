# Example Terraform variables for EC2 K3s deployment
# Copy this file to terraform.tfvars and customize for your environment

# Basic Configuration
aws_region   = "eu-central-1"  # Change to your preferred region
project_name = "moni"
environment  = "dev"        # Options: dev, staging, prod

# EC2 Configuration
instance_type = "t4g.micro"  # ARM64, Free tier eligible
                             # Other options: t4g.small, t4g.medium, t3.micro, t3.small

# Storage
volume_size = 20  # GB - Minimum 20GB recommended for K3s + apps

# SSH Access
key_name = ""  # Leave empty to generate a new key pair
               # Or specify existing key name: "my-existing-key"

# Security - IMPORTANT: Restrict these in production!
allowed_ssh_cidr = [
  "0.0.0.0/0"  # CHANGE THIS! Use your IP: ["YOUR.IP.ADDRESS.HERE/32"]
]

allowed_http_cidr = [
  "0.0.0.0/0"  # Allow HTTP access from anywhere, or restrict as needed
]

# Optional: Custom domain and SSL
domain_name = ""     # e.g., "moni.yourdomain.com" - leave empty for IP-based access
enable_ssl  = false  # Set to true if you have a domain and want SSL

# Container Images
docker_registry    = "ecr"  # Options: dockerhub, ghcr, ecr
create_ecr_repos   = false  # Set to false when using existing ECR repos

# Existing ECR repositories (use these instead of creating new ones)
existing_ecr_backend_url  = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni/moniv2"
existing_ecr_frontend_url = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni/moniv2"

# Monitoring
enable_monitoring = false  # Set to true for detailed CloudWatch monitoring ($2.10/month extra)

# K3s Version
k3s_version = "v1.28.4+k3s1"  # Stable K3s version

# Environment-specific examples:

# Development (Free Tier)
# instance_type     = "t4g.micro"
# volume_size       = 20
# enable_monitoring = false
# create_ecr_repos  = false

# Small Production
# instance_type     = "t4g.small"
# volume_size       = 30
# enable_monitoring = true
# create_ecr_repos  = true
# domain_name       = "moni.yourdomain.com"
# enable_ssl        = true

# Cost-optimized Production
# instance_type     = "t4g.medium"
# volume_size       = 40
# enable_monitoring = true
# create_ecr_repos  = true