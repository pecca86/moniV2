# K3s Installation and Configuration Script

locals {
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    k3s_version     = var.k3s_version
    project_name    = var.project_name
    environment     = var.environment
    domain_name     = var.domain_name
    enable_ssl      = var.enable_ssl
    aws_region      = var.aws_region
    instance_id     = "INSTANCE_ID_PLACEHOLDER"  # Will be replaced after instance creation
  }))
}

# EC2 Instance for K3s
resource "aws_instance" "k3s" {
  ami                     = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = local.key_name
  vpc_security_group_ids = [aws_security_group.k3s.id]
  subnet_id              = aws_subnet.public.id
  
  # User data for K3s installation
  user_data_replace_on_change = true
  user_data                   = local.user_data

  # Root volume configuration
  root_block_device {
    volume_type = "gp3"
    volume_size = var.volume_size
    encrypted   = true
    
    tags = merge(local.common_tags, {
      Name = "${local.instance_name}-root-volume"
    })
  }

  # Enable detailed monitoring if specified
  monitoring = var.enable_monitoring

  # Instance metadata service configuration
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"  # Enforce IMDSv2
  }

  tags = merge(local.common_tags, {
    Name = local.instance_name
    Type = "k3s-server"
  })

  # Wait for instance to be ready before proceeding
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait || echo 'Cloud-init completed with warnings'",
      "echo 'Cloud-init status:'",
      "cloud-init status",
      "echo 'Checking K3s service status...'",
      "sudo systemctl status k3s --no-pager || echo 'K3s service not found yet'",
      "if sudo systemctl is-active --quiet k3s; then",
      "  echo '✅ K3s is running successfully'",
      "  kubectl get nodes || echo 'kubectl not ready yet'",
      "else",
      "  echo '❌ K3s is not running - checking logs...'",
      "  echo 'K3s service logs:'",
      "  sudo journalctl -u k3s --no-pager --lines=10 || echo 'No K3s logs yet'",
      "  echo 'Cloud-init output:'", 
      "  sudo tail -20 /var/log/cloud-init-output.log || echo 'No cloud-init output yet'",
      "fi"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = var.key_name == "" ? tls_private_key.generated[0].private_key_pem : file("~/.ssh/${var.key_name}.pem")
      host        = self.public_ip
      timeout     = "15m"
    }
  }
}

# Elastic IP for static public IP (optional but recommended)
resource "aws_eip" "k3s" {
  count = var.domain_name != "" ? 1 : 0
  
  domain   = "vpc"
  instance = aws_instance.k3s.id

  tags = merge(local.common_tags, {
    Name = "${local.instance_name}-eip"
  })

  depends_on = [aws_internet_gateway.main]
}

# Copy kubeconfig from instance
resource "null_resource" "kubeconfig" {
  depends_on = [aws_instance.k3s]

  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait || echo 'Cloud-init finished with warnings'",
      "echo 'Checking K3s installation status...'",
      "sudo systemctl status k3s --no-pager || echo 'K3s not yet started'",
      "echo 'Waiting for K3s to create kubeconfig (max 10 minutes)...'",
      "timeout=600",
      "elapsed=0",
      "while [ ! -f /etc/rancher/k3s/k3s.yaml ] && [ $elapsed -lt $timeout ]; do",
      "  echo \"Waiting for kubeconfig... ($elapsed/$timeout seconds)\"",
      "  sleep 10",
      "  elapsed=$((elapsed + 10))",
      "done",
      "if [ ! -f /etc/rancher/k3s/k3s.yaml ]; then",
      "  echo 'ERROR: K3s kubeconfig not found after timeout'",
      "  echo 'K3s service status:'",
      "  sudo systemctl status k3s --no-pager",
      "  echo 'K3s logs:'", 
      "  sudo journalctl -u k3s --no-pager --lines=20",
      "  echo 'Cloud-init logs:'",
      "  sudo tail -50 /var/log/cloud-init-output.log",
      "  exit 1",
      "fi",
      "echo 'K3s kubeconfig found, copying to /tmp'",
      "sudo cp /etc/rancher/k3s/k3s.yaml /tmp/k3s.yaml",
      "sudo chown ec2-user:ec2-user /tmp/k3s.yaml",
      "echo 'Kubeconfig ready for download'"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = var.key_name == "" ? tls_private_key.generated[0].private_key_pem : file("~/.ssh/${var.key_name}.pem")
      host        = aws_instance.k3s.public_ip
      timeout     = "15m"
    }
  }

  provisioner "local-exec" {
    command = <<-EOT
      scp -i ${var.key_name == "" ? "${path.module}/${local.instance_name}-key.pem" : "~/.ssh/${var.key_name}.pem"} \
          -o StrictHostKeyChecking=no \
          -o UserKnownHostsFile=/dev/null \
          ec2-user@${aws_instance.k3s.public_ip}:/tmp/k3s.yaml \
          ${path.module}/kubeconfig
      
      # Update server IP in kubeconfig
      sed -i.bak 's/127.0.0.1/${aws_instance.k3s.public_ip}/g' ${path.module}/kubeconfig
      rm -f ${path.module}/kubeconfig.bak
      
      echo "Kubeconfig saved to: ${path.module}/kubeconfig"
      echo "Use: export KUBECONFIG=${path.module}/kubeconfig"
    EOT
  }

  triggers = {
    instance_id = aws_instance.k3s.id
  }
}