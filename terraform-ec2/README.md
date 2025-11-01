# EC2 K3s Deployment for Moni Application

A cost-effective Terraform configuration that deploys your Moni application using K3s (lightweight Kubernetes) on a single EC2 instance.

## 💰 Cost Comparison

| Component | EKS (terraform/) | EC2 K3s (terraform-ec2/) |
|-----------|------------------|---------------------------|
| **Control Plane** | $73/month | $0 (K3s is free) |
| **Worker Nodes** | $30+/month | $3.50/month (t4g.micro) |
| **Load Balancer** | $16+/month | $0 (NodePort/Ingress) |
| **Storage** | $2+/month | $1.60/month (20GB) |
| **Total** | **~$120+/month** | **~$5/month** |
| **Free Tier** | Not eligible | **$0/month** (first 12 months) |

## 🏗️ What This Creates

### Infrastructure
- ✅ **Single EC2 instance** (t4g.micro - ARM64, free tier eligible)
- ✅ **Custom VPC** with public subnet
- ✅ **Security Groups** properly configured
- ✅ **K3s cluster** with Docker runtime
- ✅ **Traefik ingress** controller (built-in)

### Features
- ✅ **Auto-installation** of K3s, Docker, and tools
- ✅ **Kubernetes manifests** for your Moni application
- ✅ **Helper scripts** for deployment and management
- ✅ **Optional ECR repositories** for private images
- ✅ **Optional SSL/TLS** with Let's Encrypt
- ✅ **Cost optimization** with ARM64 instances

## 📋 Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Terraform** >= 1.0
3. **Your Docker images** available (public or push to ECR)

## 🚀 Quick Start

### 1. Configure Variables

```bash
cd terraform-ec2

# Copy example configuration  
cp terraform.tfvars.example terraform.tfvars

# Edit for your needs
nano terraform.tfvars
```

**Important settings:**
- `aws_region`: Your preferred AWS region
- `allowed_ssh_cidr`: **Restrict to your IP!** (security)
- `key_name`: Leave empty to auto-generate SSH key
- `domain_name`: Optional custom domain
- `create_ecr_repos`: Set to `true` for private repositories

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Deploy (takes ~5-10 minutes)
terraform apply
```

### 3. Access Your Instance

```bash
# Get SSH command from output
terraform output ssh_command

# SSH to your instance
ssh -i ./moni-dev-k3s-key.pem ec2-user@YOUR_INSTANCE_IP
```

### 4. Deploy Your Application

```bash
# On the EC2 instance, run the deployment script
./deploy-moni.sh

# Check status
k3s-status
kubectl get pods -n moni
```

### 5. Access Your Application

```bash
# Get application URLs
terraform output application_urls

# Access via NodePort
curl http://YOUR_INSTANCE_IP:30080
```

## 🐳 Container Images

### Option 1: Public Images (Default)
Uses pre-built images from Docker Hub:
- `pecca86/moni-be:latest`
- `pecca86/moni-fe:latest`

### Option 2: Private ECR (Recommended for Production)
Set `create_ecr_repos = true` and push your images:

```bash
# Get ECR login command
terraform output ecr_login_command

# Build and push images
terraform output docker_build_commands
```

## 🔧 Management Commands

All available via Terraform outputs:

```bash
# View all useful commands
terraform output useful_commands

# SSH to instance
terraform output ssh_command

# Use kubectl locally
terraform output kubeconfig_command
export KUBECONFIG=./kubeconfig
kubectl get pods -n moni
```

## 📊 Instance Specifications

| Spec | t4g.micro | t4g.small | t4g.medium |
|------|-----------|-----------|------------|
| **vCPUs** | 2 | 2 | 2 |
| **Memory** | 1 GB | 2 GB | 4 GB |
| **Network** | Up to 5 Gbps | Up to 5 Gbps | Up to 5 Gbps |
| **Cost/month** | $3.50 ($0 free tier) | $7.00 | $14.00 |
| **Suitable for** | Dev/Demo | Small prod | Production |

## 🌐 Access Options

### 1. NodePort (Default)
Direct access via instance IP:
- Frontend: `http://INSTANCE_IP:30080`
- Backend: `http://INSTANCE_IP:30080` (same port, different paths)

### 2. Custom Domain (Optional)
Set `domain_name` in variables:
- Configure DNS to point to your instance IP
- Access: `http://yourdomain.com`
- Optional SSL with `enable_ssl = true`

### 3. Local kubectl
Use the generated kubeconfig:
```bash
export KUBECONFIG=./kubeconfig
kubectl port-forward svc/moni-fe 8080:80 -n moni
```

## 🔒 Security Features

- **Private SSH key** auto-generated
- **Security groups** restrict access to necessary ports
- **IMDSv2 enforced** on EC2 instance
- **EBS encryption** enabled by default
- **Optional SSL/TLS** with Let's Encrypt

## 📈 Scaling Options

### Vertical Scaling (Single Instance)
```hcl
# In terraform.tfvars
instance_type = "t4g.small"  # or t4g.medium
volume_size   = 40           # Increase storage
```

### Horizontal Scaling (Multiple Instances)
For high availability, consider:
- Multiple instances with load balancer
- RDS for database (instead of PostgreSQL pod)
- EFS for shared storage

## 🛠️ Troubleshooting

### Instance Issues
```bash
# SSH to instance
ssh -i ./moni-dev-k3s-key.pem ec2-user@INSTANCE_IP

# Check K3s status
sudo systemctl status k3s
kubectl get nodes

# Check installation logs
sudo cat /var/log/k3s-install.log
```

### Application Issues
```bash
# Check pod status
kubectl get pods -n moni

# View logs
kubectl logs -l app=moni-be -n moni
kubectl logs -l app=moni-fe -n moni

# Restart deployment
kubectl rollout restart deployment/moni-be -n moni
```

### Common Solutions
1. **Pod pending**: Check resource availability with `kubectl describe pod`
2. **Image pull errors**: Verify image names and registry access
3. **Database issues**: Check PostgreSQL pod logs and persistent volume

## 💡 Cost Optimization Tips

### Free Tier Benefits
- **EC2**: 750 hours/month free (t2.micro/t3.micro)
- **EBS**: 30GB free storage
- **Data Transfer**: 1GB/month free

### Production Cost Savings
- Use **Spot Instances** for ~70% savings
- **Schedule shutdown** during off-hours
- **Right-size** instance based on actual usage
- Use **RDS Free Tier** for database

### Monitoring Costs
```bash
# Check current AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 🔄 Maintenance

### Updates
```bash
# Update K3s
ssh ec2-user@INSTANCE_IP 'curl -sfL https://get.k3s.io | sh -s - --docker'

# Update application
kubectl set image deployment/moni-be moni-be=NEW_IMAGE:TAG -n moni
```

### Backups
```bash
# Backup database
kubectl exec -it deployment/moni-db -n moni -- pg_dump -U postgres moni > backup.sql

# Backup K3s config
sudo cp /var/lib/rancher/k3s/server/db/state.db /backup/
```

## 🗑️ Cleanup

```bash
# Destroy all resources
terraform destroy

# Clean up local files
rm -f kubeconfig moni-k3s.yaml *.pem
```

## 📚 File Structure

```
terraform-ec2/
├── main.tf                    # Main configuration
├── variables.tf               # Input variables  
├── networking.tf              # VPC and security
├── ssh-keys.tf               # SSH key management
├── ec2.tf                    # EC2 instance and K3s
├── k8s-manifests.tf          # Kubernetes configs
├── moni-k3s.yaml.tpl         # K8s manifest template
├── user-data.sh              # Instance initialization
├── outputs.tf                # Output values
├── terraform.tfvars.example  # Example configuration
└── README.md                 # This file
```

## 🎯 Use Cases

### Perfect For:
- **Development environments**
- **Small production workloads**  
- **Learning Kubernetes**
- **Cost-conscious deployments**
- **Single-application deployments**

### Not Suitable For:
- **High-availability production** (single point of failure)
- **Large-scale applications** (resource constraints)
- **Multi-tenant workloads** (security isolation)
- **Compliance requirements** (managed services needed)

## 🆚 vs EKS Comparison

| Feature | EKS (terraform/) | K3s (terraform-ec2/) |
|---------|------------------|----------------------|
| **Setup Time** | 15-20 min | 5-10 min |
| **Complexity** | High | Low |
| **Cost** | $120+/month | $5/month |
| **Scalability** | Excellent | Limited |
| **High Availability** | Built-in | Manual setup |
| **Managed Control Plane** | Yes | No |
| **Production Ready** | Yes | Small scale |
| **Learning Curve** | Steep | Gentle |

Choose **EKS** for production workloads, **K3s** for development and small applications!