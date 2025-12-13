# Outputs for K3s EC2 Deployment

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

output "kubectl_command" {
  description = "Command to configure kubectl"
  value       = "export KUBECONFIG=${path.module}/kubeconfig"
}

output "application_urls" {
  description = "URLs to access the application"
  value = {
    frontend = "http://${aws_instance.k3s.public_ip}:30081"
    backend  = "http://${aws_instance.k3s.public_ip}:30080"
    note     = "Frontend proxies /api requests to backend automatically"
  }
}

output "ecr_repositories" {
  description = "ECR repository URLs"
  value = {
    backend_url  = var.ecr_backend_url
    frontend_url = var.ecr_frontend_url
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
    k3s_version   = var.k3s_version
  }
}

output "cost_estimate" {
  description = "Estimated monthly cost breakdown"
  value = {
    ec2_instance    = "~$3.50/month (t4g.micro free tier: $0)"
    ebs_volume      = "~$${var.volume_size * 0.08}/month"
    elastic_ip      = var.domain_name != "" ? "~$3.65/month (when not attached)" : "Not allocated"
    estimated_total = var.domain_name != "" ? "~$${3.50 + (var.volume_size * 0.08) + 3.65}/month" : "~$${3.50 + (var.volume_size * 0.08)}/month"
    free_tier_note  = "First 12 months: EC2 instance is free (750 hours/month)"
  }
}

output "useful_commands" {
  description = "Useful commands for managing the K3s deployment"
  value = {
    ssh_connect    = "ssh -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} ec2-user@${aws_instance.k3s.public_ip}"
    kubectl_config = "export KUBECONFIG=${path.module}/kubeconfig"
    get_nodes      = "kubectl get nodes"
    get_pods       = "kubectl get pods -n moni"
    get_services   = "kubectl get svc -n moni"
    view_logs_be   = "kubectl logs -l app=moni-be -n moni"
    view_logs_fe   = "kubectl logs -l app=moni-fe -n moni"
  }
}

output "next_steps" {
  description = "Next steps after Terraform deployment"
  value = [
    "1. Wait for EC2 instance to be ready (2-3 minutes)",
    "2. Configure kubectl: export KUBECONFIG=${path.module}/kubeconfig",
    "3. Verify cluster: kubectl get nodes",
    "4. Deploy application: kubectl apply -f ../manifests/moni-app.yaml",
    "5. Check pods: kubectl get pods -n moni",
    "6. Access frontend: http://${aws_instance.k3s.public_ip}:30081",
    "7. Access backend API: http://${aws_instance.k3s.public_ip}:30080"
  ]
}

output "k3s_learning_tips" {
  description = "Learning resources and tips"
  value = {
    k3s_status          = "SSH and run: k3s-status"
    view_moni_logs      = "SSH and run: moni-logs"
    kubectl_cheatsheet  = "https://kubernetes.io/docs/reference/kubectl/cheatsheet/"
    k3s_docs            = "https://docs.k3s.io/"
  }
}
