# Variables for K3s EC2 Deployment

variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "moni"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type (ARM64 recommended for cost savings)"
  type        = string
  default     = "t4g.small"
}

variable "volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 20
}

variable "k3s_version" {
  description = "K3s version to install"
  type        = string
  default     = "v1.28.4+k3s1"
}

variable "key_name" {
  description = "Name of existing SSH key pair. Leave empty to generate a new one."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

variable "enable_ssl" {
  description = "Enable SSL with Let's Encrypt (requires domain_name)"
  type        = bool
  default     = false
}

variable "enable_monitoring" {
  description = "Enable detailed EC2 monitoring"
  type        = bool
  default     = false
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_http_cidr" {
  description = "CIDR blocks allowed for HTTP/HTTPS access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# ECR Configuration
variable "ecr_backend_url" {
  description = "ECR URL for backend image"
  type        = string
  default     = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-be"
}

variable "ecr_frontend_url" {
  description = "ECR URL for frontend image"
  type        = string
  default     = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-fe"
}
