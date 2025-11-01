# ECR Repositories (Optional)
resource "aws_ecr_repository" "moni_backend" {
  count = var.create_ecr_repos ? 1 : 0
  
  name                 = "${var.project_name}-be-ec2"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(local.common_tags, {
    Name      = "${var.project_name}-backend-repository-ec2"
    Component = "backend"
  })
}

resource "aws_ecr_repository" "moni_frontend" {
  count = var.create_ecr_repos ? 1 : 0
  
  name                 = "${var.project_name}-fe-ec2"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(local.common_tags, {
    Name      = "${var.project_name}-frontend-repository-ec2"
    Component = "frontend"
  })
}

# Create Kubernetes manifest file for the instance
resource "local_file" "k3s_manifest" {
  filename = "${path.module}/moni-k3s.yaml"
  
  content = templatefile("${path.module}/moni-k3s.yaml.tpl", {
    backend_image  = local.backend_image_url
    frontend_image = local.frontend_image_url
    domain_name    = var.domain_name
    enable_ssl     = var.enable_ssl
    environment    = var.environment
  })
}

# Local values to determine which image URLs to use
locals {
  # Backend image logic: existing ECR > new ECR > public image
  backend_image_url = var.existing_ecr_backend_url != "" ? "${var.existing_ecr_backend_url}:latest" : (
    var.create_ecr_repos ? "${aws_ecr_repository.moni_backend[0].repository_url}:latest" : "pecca86/moni-be:latest"
  )
  
  # Frontend image logic: existing ECR > new ECR > public image  
  frontend_image_url = var.existing_ecr_frontend_url != "" ? "${var.existing_ecr_frontend_url}:latest" : (
    var.create_ecr_repos ? "${aws_ecr_repository.moni_frontend[0].repository_url}:latest" : "pecca86/moni-fe:latest"
  )
}

# Upload the manifest to the EC2 instance
resource "null_resource" "upload_manifest" {
  depends_on = [aws_instance.k3s, local_file.k3s_manifest]

  provisioner "file" {
    source      = local_file.k3s_manifest.filename
    destination = "/home/ec2-user/moni-k3s.yaml"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = var.key_name == "" ? tls_private_key.generated[0].private_key_pem : file("~/.ssh/${var.key_name}.pem")
      host        = aws_instance.k3s.public_ip
      timeout     = "5m"
    }
  }

  triggers = {
    manifest_content = local_file.k3s_manifest.content
    instance_id      = aws_instance.k3s.id
  }
}