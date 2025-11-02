# Outputs for EC2 K3s deployment

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.k3s.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.k3s.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.k3s.public_dns
}

output "elastic_ip" {
  description = "Elastic IP address (if domain is configured)"
  value       = var.domain_name != "" ? aws_eip.k3s[0].public_ip : null
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
}

output "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  value       = "${path.module}/kubeconfig"
}

output "kubeconfig_command" {
  description = "Command to use the kubeconfig"
  value       = "export KUBECONFIG=${path.module}/kubeconfig"
}

output "application_urls" {
  description = "URLs to access the application"
  value = {
    frontend_nodeport = "http://${aws_instance.k3s.public_ip}:30081"
    backend_nodeport  = "http://${aws_instance.k3s.public_ip}:30080"
    domain_url        = var.domain_name != "" ? "http${var.enable_ssl ? "s" : ""}://${var.domain_name}" : null
  }
}

output "ecr_repositories" {
  description = "ECR repository URLs being used"
  value = {
    backend_url  = local.backend_image_url
    frontend_url = local.frontend_image_url
    source = var.existing_ecr_backend_url != "" ? "existing_ecr" : (
      var.create_ecr_repos ? "new_ecr" : "public_dockerhub"
    )
  }
}

output "instance_specs" {
  description = "Instance specifications"
  value = {
    instance_type = var.instance_type
    ami_id        = data.aws_ami.amazon_linux.id
    ami_name      = data.aws_ami.amazon_linux.name
    vpc_id        = aws_vpc.main.id
    subnet_id     = aws_subnet.public.id
    volume_size   = "${var.volume_size}GB"
  }
}

output "cost_estimate" {
  description = "Estimated monthly cost breakdown"
  value = {
    ec2_instance    = "~$3.50/month (t4g.micro in free tier: $0)"
    ebs_volume      = "~$${var.volume_size * 0.08}/month"
    elastic_ip      = var.domain_name != "" ? "~$3.65/month (when not attached to running instance)" : "Not allocated"
    data_transfer   = "1GB free per month, then $0.09/GB"
    estimated_total = var.domain_name != "" ? "~$${3.50 + (var.volume_size * 0.08) + 3.65}/month" : "~$${3.50 + (var.volume_size * 0.08)}/month"
    free_tier_note  = "First 12 months: EC2 instance is free (750 hours/month)"
  }
}

output "useful_commands" {
  description = "Useful commands for managing the deployment"
  value = {
    ssh_connect      = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
    set_kubeconfig   = "export KUBECONFIG=${path.module}/kubeconfig"
    deploy_app       = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip} './deploy-moni.sh'"
    check_k3s_status = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip} 'k3s-status'"
    view_logs        = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip} 'moni-logs'"
  }
}

output "next_steps" {
  description = "Next steps after deployment"
  value = [
    "1. Wait for deployment to complete (5-10 minutes)",
    "2. SSH to instance: ${local.ssh_command_short}",
    "3. Deploy application: ./deploy-moni.sh",
    "4. Access frontend: http://${aws_instance.k3s.public_ip}:30081",
    var.domain_name != "" ? "5. Configure DNS: Point ${var.domain_name} to ${var.domain_name != "" ? aws_eip.k3s[0].public_ip : aws_instance.k3s.public_ip}" : "5. Optional: Configure a domain name for easier access"
  ]
}

# Local values for cleaner output
locals {
  ssh_command_short = "ssh -i ${var.key_name == "" ? "./${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
}

# ECR login command (if ECR repos are created)
output "ecr_login_command" {
  description = "Command to login to ECR (if repositories are created)"
  value = var.create_ecr_repos ? "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com" : null
}

output "docker_build_commands" {
  description = "Commands to build and push images to ECR (if repositories are created)"
  value = var.create_ecr_repos ? {
    backend_commands = [
      "# Build and push backend image",
      "docker build -t moni-be-slim:latest -f Dockerfile .",
      "docker tag moni-be-slim:latest ${aws_ecr_repository.moni_backend[0].repository_url}:latest", 
      "docker push ${aws_ecr_repository.moni_backend[0].repository_url}:latest"
    ]
    frontend_commands = [
      "# Build and push frontend image", 
      "cd FE/moni-fe",
      "docker build -t moni-fe:latest .",
      "docker tag moni-fe:latest ${aws_ecr_repository.moni_frontend[0].repository_url}:latest",
      "docker push ${aws_ecr_repository.moni_frontend[0].repository_url}:latest"
    ]
    note = "ECR repositories created - use these commands to push images"
    recommendation = "Run 'terraform output ecr_login_command' first to authenticate"
  } : {
    backend_commands = [
      "# Using existing or public images - no build needed",
      "echo 'Backend image: ${local.backend_image_url}'",
    ]
    frontend_commands = [
      "# Using existing or public images - no build needed", 
      "echo 'Frontend image: ${local.frontend_image_url}'",
    ]
    note = var.existing_ecr_backend_url != "" ? "Using existing ECR images" : "Using public Docker Hub images"
    recommendation = var.existing_ecr_backend_url != "" ? "Images already available in ECR" : "Set create_ecr_repos = true for private repositories"
  }
}