# Variables for EC2 K3s deployment

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "moni"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type for K3s node"
  type        = string
  default     = "t4g.micro"  # ARM64, 1 vCPU, 1GB RAM - Free tier eligible
}

variable "key_name" {
  description = "Name of AWS key pair for SSH access"
  type        = string
  default     = ""  # Leave empty to create a new key pair
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed SSH access to the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Restrict this in production!
}

variable "allowed_http_cidr" {
  description = "CIDR blocks allowed HTTP/HTTPS access to applications"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 20  # Minimum recommended for K3s + applications
}

variable "enable_monitoring" {
  description = "Enable detailed monitoring for the EC2 instance"
  type        = bool
  default     = false  # Keep false for free tier
}

variable "k3s_version" {
  description = "Version of K3s to install"
  type        = string
  default     = "v1.28.4+k3s1"  # Stable K3s version
}

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

variable "enable_ssl" {
  description = "Enable SSL/TLS with Let's Encrypt (requires domain_name)"
  type        = bool
  default     = false
}

variable "docker_registry" {
  description = "Docker registry to use (dockerhub, ghcr, etc.)"
  type        = string
  default     = "dockerhub"
}

variable "create_ecr_repos" {
  description = "Create ECR repositories for images"
  type        = bool
  default     = false  # Use false for cost savings, true for private repos
}

variable "existing_ecr_backend_url" {
  description = "Existing ECR repository URL for backend image (if not creating new repos)"
  type        = string
  default     = ""
}

variable "existing_ecr_frontend_url" {
  description = "Existing ECR repository URL for frontend image (if not creating new repos)"
  type        = string
  default     = ""
}