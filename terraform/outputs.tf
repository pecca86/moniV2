# Outputs for important resource information

output "cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = module.eks.cluster_arn
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_version" {
  description = "EKS cluster version"
  value       = module.eks.cluster_version
}

output "cluster_platform_version" {
  description = "EKS cluster platform version"
  value       = module.eks.cluster_platform_version
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster for the OpenID Connect identity provider"
  value       = module.eks.cluster_oidc_issuer_url
}

output "cluster_primary_security_group_id" {
  description = "The cluster primary security group ID created by EKS"
  value       = module.eks.cluster_primary_security_group_id
}

output "vpc_id" {
  description = "ID of the VPC where the cluster is deployed"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "ecr_backend_repository_url" {
  description = "URL of the ECR repository for backend"
  value       = var.create_ecr_repositories ? aws_ecr_repository.moni_backend[0].repository_url : null
}

output "ecr_frontend_repository_url" {
  description = "URL of the ECR repository for frontend"
  value       = var.create_ecr_repositories ? aws_ecr_repository.moni_frontend[0].repository_url : null
}

output "aws_load_balancer_controller_role_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM role"
  value       = var.enable_aws_load_balancer_controller ? module.aws_load_balancer_controller_irsa[0].iam_role_arn : null
}

output "cluster_autoscaler_role_arn" {
  description = "ARN of the Cluster Autoscaler IAM role"
  value       = var.enable_cluster_autoscaler ? module.cluster_autoscaler_irsa[0].iam_role_arn : null
}

# kubectl config command
output "kubectl_config_command" {
  description = "Command to update kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

# ECR login commands
output "ecr_login_command" {
  description = "Command to login to ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

# Docker build and push commands for your application
output "docker_build_commands" {
  description = "Commands to build and push Docker images to ECR"
  value = var.create_ecr_repositories ? {
    backend = [
      "docker build -t moni-be-slim:latest -f Dockerfile .",
      "docker tag moni-be-slim:latest ${aws_ecr_repository.moni_backend[0].repository_url}:latest",
      "docker push ${aws_ecr_repository.moni_backend[0].repository_url}:latest"
    ]
    frontend = [
      "cd FE/moni-fe",
      "docker build -t moni-fe:latest .",
      "docker tag moni-fe:latest ${aws_ecr_repository.moni_frontend[0].repository_url}:latest",
      "docker push ${aws_ecr_repository.moni_frontend[0].repository_url}:latest"
    ]
  } : null
}