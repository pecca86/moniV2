# K3s EC2 Instance Configuration

locals {
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    k3s_version  = var.k3s_version
    project_name = var.project_name
    environment  = var.environment
    aws_region   = var.aws_region
    ecr_registry = var.ecr_registry
  }))
}

# EC2 Instance for K3s
resource "aws_instance" "k3s" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = local.key_name
  vpc_security_group_ids = [aws_security_group.k3s.id]
  subnet_id              = aws_subnet.public.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  
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

}

# Elastic IP for static public IP (optional but recommended for production)
resource "aws_eip" "k3s" {
  count = var.domain_name != "" ? 1 : 0
  
  domain   = "vpc"
  instance = aws_instance.k3s.id

  tags = merge(local.common_tags, {
    Name = "${local.instance_name}-eip"
  })

  depends_on = [aws_internet_gateway.main]
}

