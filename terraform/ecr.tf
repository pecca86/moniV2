# ECR Repositories for Moni application images
resource "aws_ecr_repository" "moni_backend" {
  count = var.create_ecr_repositories ? 1 : 0
  
  name                 = "${var.project_name}-be"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(local.common_tags, {
    Name        = "${var.project_name}-backend-repository"
    Component   = "backend"
  })
}

resource "aws_ecr_repository" "moni_frontend" {
  count = var.create_ecr_repositories ? 1 : 0
  
  name                 = "${var.project_name}-fe"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(local.common_tags, {
    Name        = "${var.project_name}-frontend-repository"
    Component   = "frontend"
  })
}

# ECR Lifecycle policies to manage image retention
resource "aws_ecr_lifecycle_policy" "moni_backend_policy" {
  count = var.create_ecr_repositories ? 1 : 0
  
  repository = aws_ecr_repository.moni_backend[0].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Delete untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_lifecycle_policy" "moni_frontend_policy" {
  count = var.create_ecr_repositories ? 1 : 0
  
  repository = aws_ecr_repository.moni_frontend[0].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Delete untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# EBS Storage Class for persistent volumes
resource "kubernetes_storage_class_v1" "gp3" {
  metadata {
    name = "gp3"
    annotations = {
      "storageclass.kubernetes.io/is-default-class" = "true"
    }
  }
  
  storage_provisioner    = "ebs.csi.aws.com"
  volume_binding_mode    = "WaitForFirstConsumer"
  allow_volume_expansion = true
  
  parameters = {
    type      = "gp3"
    fsType    = "ext4"
    encrypted = "true"
  }

  depends_on = [module.eks]
}

# Remove default gp2 storage class
resource "kubernetes_annotations" "gp2_default" {
  api_version = "storage.k8s.io/v1"
  kind        = "StorageClass"
  
  metadata {
    name = "gp2"
  }
  
  annotations = {
    "storageclass.kubernetes.io/is-default-class" = "false"
  }

  depends_on = [module.eks]
}