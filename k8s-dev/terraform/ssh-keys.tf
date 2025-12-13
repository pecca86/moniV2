# SSH Key Pair Management

# Generate SSH key pair if none specified
resource "aws_key_pair" "generated" {
  count = var.key_name == "" ? 1 : 0
  
  key_name   = "${local.instance_name}-key"
  public_key = tls_private_key.generated[0].public_key_openssh

  tags = local.common_tags
}

resource "tls_private_key" "generated" {
  count = var.key_name == "" ? 1 : 0
  
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save private key to local file
resource "local_file" "private_key" {
  count = var.key_name == "" ? 1 : 0
  
  content  = tls_private_key.generated[0].private_key_pem
  filename = "${path.module}/${local.instance_name}-key.pem"
  
  provisioner "local-exec" {
    command = "chmod 600 ${path.module}/${local.instance_name}-key.pem"
  }
}

# Local values for key management
locals {
  key_name = var.key_name == "" ? aws_key_pair.generated[0].key_name : var.key_name
}
