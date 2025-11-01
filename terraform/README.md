# Terraform EKS Infrastructure for Moni Application

This Terraform configuration creates a production-ready AWS EKS cluster for deploying your Moni RESTful application.

## 🏗️ Infrastructure Components

### Core Infrastructure
- **EKS Cluster**: Managed Kubernetes cluster on AWS
- **VPC**: Custom VPC with public and private subnets across multiple AZs
- **Node Groups**: Auto-scaling worker nodes with spot instances for cost optimization
- **Security Groups**: Properly configured network security

### Add-ons & Controllers
- **AWS Load Balancer Controller**: For ALB/NLB Ingress support
- **Cluster Autoscaler**: Automatically scale nodes based on demand
- **EBS CSI Driver**: For persistent volume support
- **VPC CNI**: Enhanced networking for pods

### Container Registry
- **ECR Repositories**: For storing your Docker images
- **Lifecycle Policies**: Automatic cleanup of old images

### Storage
- **GP3 Storage Class**: Fast, cost-effective storage for persistent volumes
- **Default encryption**: All EBS volumes encrypted by default

## 📋 Prerequisites

1. **AWS CLI**: Configured with appropriate permissions
   ```bash
   aws configure
   ```

2. **Terraform**: Version >= 1.0
   ```bash
   # macOS
   brew install terraform
   
   # Or download from https://terraform.io/downloads
   ```

3. **kubectl**: For managing Kubernetes cluster
   ```bash
   # macOS
   brew install kubectl
   ```

4. **Required AWS Permissions**: Your AWS user/role needs:
   - EC2 full access
   - EKS full access
   - IAM role creation
   - VPC management
   - ECR repository management

## 🚀 Quick Start

### 1. Configure Variables

```bash
# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit configuration for your needs
nano terraform.tfvars
```

**Important**: Update these values in `terraform.tfvars`:
- `aws_region`: Your preferred AWS region
- `allowed_cidr_blocks`: Restrict to your IP ranges (security!)
- `node_group_instance_types`: Choose appropriate instance types

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Deploy (takes ~15-20 minutes)
terraform apply
```

### 3. Configure kubectl

```bash
# Get the kubectl config command from Terraform output
terraform output kubectl_config_command

# Run the command (example)
aws eks update-kubeconfig --region us-west-2 --name moni-dev-eks
```

### 4. Verify Cluster

```bash
# Check cluster status
kubectl get nodes

# Check system pods
kubectl get pods -n kube-system

# Verify Load Balancer Controller
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## 🐳 Deploy Your Application

### 1. Build and Push Images to ECR

```bash
# Get ECR login command from Terraform output
terraform output ecr_login_command | bash

# Get repository URLs
terraform output ecr_backend_repository_url
terraform output ecr_frontend_repository_url

# Build and push backend
docker build -t moni-be-slim:latest -f Dockerfile .
docker tag moni-be-slim:latest <BACKEND_ECR_URL>:latest
docker push <BACKEND_ECR_URL>:latest

# Build and push frontend
cd FE/moni-fe
docker build -t moni-fe:latest .
docker tag moni-fe:latest <FRONTEND_ECR_URL>:latest
docker push <FRONTEND_ECR_URL>:latest
```

### 2. Update Kubernetes Manifests

Update your `base/Moni-aws.yaml` with the ECR repository URLs:

```yaml
# Replace these lines in Moni-aws.yaml
image: YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/moni-be:latest
image: YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/moni-fe:latest
```

### 3. Deploy Application

```bash
# Deploy your application
kubectl apply -f base/Moni-aws.yaml

# Or use Ingress approach
kubectl apply -f base/aws-ingress.yaml

# Check status
kubectl get pods -n moni
kubectl get svc -n moni
kubectl get ingress -n moni  # if using ingress
```

## 📊 Monitoring & Management

### Check Cluster Status
```bash
# Cluster info
kubectl cluster-info

# Node status
kubectl get nodes -o wide

# Pod status across all namespaces
kubectl get pods -A
```

### Scaling
```bash
# Manual node scaling (if needed)
aws eks update-nodegroup-config \
  --cluster-name $(terraform output -raw cluster_name) \
  --nodegroup-name main \
  --scaling-config minSize=1,maxSize=5,desiredSize=3
```

### Cost Monitoring
```bash
# Check current costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## 💰 Cost Optimization

### Development Environment
```hcl
# In terraform.tfvars
node_group_instance_types = ["t3.small"]
node_group_desired_size   = 1
node_group_max_size      = 2
node_group_min_size      = 0  # Can scale to zero
```

### Production Environment
```hcl
# In terraform.tfvars
node_group_instance_types = ["m5.large"]
node_group_desired_size   = 3
node_group_max_size      = 10
node_group_min_size      = 2
```

## 🔧 Customization

### Different Instance Types
```hcl
# For CPU-intensive workloads
node_group_instance_types = ["c5.large", "c5.xlarge"]

# For memory-intensive workloads
node_group_instance_types = ["r5.large", "r5.xlarge"]

# Mixed instance types for cost optimization
node_group_instance_types = ["t3.medium", "t3.large", "m5.large"]
```

### Multi-Environment Setup
```bash
# Use workspaces for different environments
terraform workspace new staging
terraform workspace new production

# Or use separate state files
terraform init -backend-config="key=moni/staging/terraform.tfstate"
```

## 🗑️ Cleanup

### Destroy Infrastructure
```bash
# Delete your application first
kubectl delete -f base/Moni-aws.yaml

# Then destroy Terraform resources
terraform destroy
```

**⚠️ Warning**: This will delete ALL resources including data in persistent volumes!

## 📁 File Structure

```
terraform/
├── main.tf              # Main configuration and providers
├── variables.tf         # Input variables
├── vpc.tf              # VPC and networking
├── eks.tf              # EKS cluster configuration
├── addons.tf           # EKS add-ons and controllers
├── ecr.tf              # Container registry and storage
├── outputs.tf          # Output values
└── terraform.tfvars.example  # Example configuration
```

## 🔐 Security Best Practices

1. **Restrict CIDR blocks**: Never use `0.0.0.0/0` in production
2. **Use private subnets**: Worker nodes are in private subnets
3. **Enable encryption**: EBS volumes encrypted by default
4. **IAM roles**: Using IRSA instead of storing credentials
5. **Image scanning**: ECR scans images for vulnerabilities
6. **Network policies**: Consider implementing Kubernetes network policies

## 📚 Additional Resources

- [EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)

## 🆘 Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your AWS credentials have sufficient permissions
2. **Cluster Access**: Run the kubectl config command from outputs
3. **Pod Pending**: Check node capacity and resource requests
4. **Load Balancer Not Creating**: Verify AWS Load Balancer Controller is running

### Get Help
```bash
# Check Terraform logs
export TF_LOG=DEBUG
terraform apply

# Check Kubernetes events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check pod logs
kubectl logs -f deployment/moni-be -n moni
```