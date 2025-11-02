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

output "docker_compose_info" {
  description = "Docker Compose deployment information"
  value = {
    deployment_path = "~/moni-deployment"
    compose_file    = "docker-compose.yml"
    env_file        = ".env"
    config_path     = "nginx-config/default.conf"
  }
}

output "application_urls" {
  description = "URLs to access the application via Docker Compose"
  value = {
    frontend_direct = "http://${aws_instance.k3s.public_ip}:30081"
    backend_api     = "http://${aws_instance.k3s.public_ip}:30080"
    frontend_proxy  = "http://${aws_instance.k3s.public_ip}:30081/api"
    note            = "Frontend proxies API requests to backend automatically"
  }
}

output "ecr_repositories" {
  description = "ECR repository URLs for Docker Compose deployment"
  value = {
    backend_url  = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-be"
    frontend_url = "026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-fe"
    source       = "existing_ecr"
    note         = "Using existing ECR repositories with Docker Compose"
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
  description = "Useful commands for managing the Docker Compose deployment"
  value = {
    ssh_connect     = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
    deploy_app      = "./deploy-simple.sh ${aws_instance.k3s.public_ip}"
    check_status    = "./manage-app.sh ${aws_instance.k3s.public_ip} status"
    view_logs       = "./manage-app.sh ${aws_instance.k3s.public_ip} logs"
    restart_app     = "./manage-app.sh ${aws_instance.k3s.public_ip} restart"
    update_images   = "./manage-app.sh ${aws_instance.k3s.public_ip} update"
    validate_app    = "./validate-deployment.sh ${aws_instance.k3s.public_ip}"
  }
}

output "next_steps" {
  description = "Next steps after Terraform deployment"
  value = [
    "1. Wait for EC2 instance to be ready (2-3 minutes)",
    "2. Deploy application: ./deploy-simple.sh ${aws_instance.k3s.public_ip}",
    "3. Check status: ./manage-app.sh ${aws_instance.k3s.public_ip} status",
    "4. Access frontend: http://${aws_instance.k3s.public_ip}:30081",
    "5. Access backend API: http://${aws_instance.k3s.public_ip}:30080",
    "6. Validate deployment: ./validate-deployment.sh ${aws_instance.k3s.public_ip}",
    var.domain_name != "" ? "7. Configure DNS: Point ${var.domain_name} to ${var.domain_name != "" ? aws_eip.k3s[0].public_ip : aws_instance.k3s.public_ip}" : "7. Optional: Configure a domain name for easier access"
  ]
}

# Local values for cleaner output
locals {
  ssh_command_short = "ssh -i ${var.key_name == "" ? "./${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
}

# ECR login command (if ECR repos are created)
output "ecr_login_command" {
  description = "Command to login to ECR for Docker operations"
  value = "aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 026596707189.dkr.ecr.eu-central-1.amazonaws.com"
}

output "deployment_commands" {
  description = "Commands to deploy application using Docker Compose"
  value = {
    deploy_command = "./deploy-simple.sh ${aws_instance.k3s.public_ip}"
    manage_commands = [
      "./manage-app.sh ${aws_instance.k3s.public_ip} status",
      "./manage-app.sh ${aws_instance.k3s.public_ip} update", 
      "./manage-app.sh ${aws_instance.k3s.public_ip} logs",
      "./manage-app.sh ${aws_instance.k3s.public_ip} restart"
    ]
    validation_command = "./validate-deployment.sh ${aws_instance.k3s.public_ip}"
    note = "Using Docker Compose with ECR images"
    ecr_login = "aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 026596707189.dkr.ecr.eu-central-1.amazonaws.com"
  }
}