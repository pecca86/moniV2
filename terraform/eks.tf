# EKS Cluster Configuration
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.20"

  cluster_name    = local.cluster_name
  cluster_version = var.cluster_version

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Additional security groups
  cluster_additional_security_group_ids = [aws_security_group.additional.id]

  # EKS Managed Node Group(s)
  eks_managed_node_group_defaults = {
    instance_types = var.node_group_instance_types
    
    # Use the latest EKS optimized AMI
    ami_type = "AL2_x86_64"
    
    # Ensure pods can communicate with each other across nodes
    vpc_security_group_ids = [aws_security_group.additional.id]
  }

  eks_managed_node_groups = {
    main = {
      name = "${local.cluster_name}-main"

      instance_types = var.node_group_instance_types

      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      desired_size = var.node_group_desired_size

      # Use spot instances for cost savings (remove for production)
      capacity_type = "SPOT"

      # Labels for workload scheduling
      labels = {
        Environment = var.environment
        NodeGroup   = "main"
      }

      # Taints for workload isolation (optional)
      # taints = {
      #   dedicated = {
      #     key    = "dedicated"
      #     value  = "moni"
      #     effect = "NO_SCHEDULE"
      #   }
      # }

      tags = merge(local.common_tags, {
        Name = "${local.cluster_name}-main-node-group"
      })
    }
  }

  # Cluster access entry for current user
  enable_cluster_creator_admin_permissions = true

  # aws-auth configmap
  manage_aws_auth_configmap = true

  aws_auth_roles = [
    {
      rolearn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/AWSReservedSSO_*"
      username = "sso-admin"
      groups   = ["system:masters"]
    },
  ]

  tags = local.common_tags
}

# EKS add-ons
resource "aws_eks_addon" "addons" {
  for_each = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent              = true
      service_account_role_arn = module.vpc_cni_irsa.iam_role_arn
    }
    aws-ebs-csi-driver = {
      most_recent              = true
      service_account_role_arn = var.enable_ebs_csi_driver ? module.ebs_csi_irsa[0].iam_role_arn : null
    }
  }

  cluster_name             = module.eks.cluster_name
  addon_name               = each.key
  addon_version            = try(each.value.addon_version, null)
  resolve_conflicts        = "OVERWRITE"
  service_account_role_arn = try(each.value.service_account_role_arn, null)

  depends_on = [module.eks]

  tags = local.common_tags
}

# IRSA for VPC CNI
module "vpc_cni_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.30"

  role_name_prefix      = "VPC-CNI-IRSA"
  attach_vpc_cni_policy = true
  vpc_cni_enable_ipv4   = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-node"]
    }
  }

  tags = local.common_tags
}

# IRSA for EBS CSI Driver
module "ebs_csi_irsa" {
  count = var.enable_ebs_csi_driver ? 1 : 0
  
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.30"

  role_name_prefix      = "EBS-CSI-IRSA"
  attach_ebs_csi_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }

  tags = local.common_tags
}