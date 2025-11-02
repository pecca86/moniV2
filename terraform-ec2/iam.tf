# IAM role and instance profile for EC2 to access ECR

# IAM role for EC2 instance
resource "aws_iam_role" "ec2_ecr_role" {
  name = "${local.instance_name}-ecr-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.instance_name}-ecr-role"
  })
}

# IAM policy for ECR access
resource "aws_iam_role_policy" "ecr_policy" {
  name = "${local.instance_name}-ecr-policy"
  role = aws_iam_role.ec2_ecr_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance profile to attach the role to EC2
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${local.instance_name}-profile"
  role = aws_iam_role.ec2_ecr_role.name

  tags = merge(local.common_tags, {
    Name = "${local.instance_name}-profile"
  })
}