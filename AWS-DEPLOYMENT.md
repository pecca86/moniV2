# AWS Deployment Guide for Moni Application

## Prerequisites

1. **EKS Cluster**: You need an Amazon EKS cluster running
2. **AWS Load Balancer Controller**: Installed in your cluster for ALB Ingress
3. **ECR Repositories**: For storing your Docker images
4. **Domain Name**: (Optional) For custom domain access

## Deployment Options

### Option 1: LoadBalancer Service (Simplest)

Use the modified `Moni.yaml` with `type: LoadBalancer`. This will:
- Create an AWS Classic Load Balancer automatically
- Give you an external IP/hostname to access your app
- Cost: ~$18/month per load balancer

```bash
kubectl apply -f base/Moni.yaml
kubectl get svc -n moni moni-fe
# Wait for EXTERNAL-IP to be assigned
```

### Option 2: Application Load Balancer with Ingress (Recommended)

#### Step 1: Install AWS Load Balancer Controller

```bash
# Install AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=your-cluster-name \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

#### Step 2: Deploy Application

```bash
# Deploy the AWS-optimized version
kubectl apply -f base/Moni-aws.yaml

# Deploy the Ingress
kubectl apply -f base/ingress.yaml
```

#### Step 3: Get Access URL

```bash
kubectl get ingress -n moni
# Look for ADDRESS column - this is your ALB DNS name
```

### Option 3: NodePort with Manual Load Balancer

Keep NodePort and create an ALB manually in AWS console pointing to your worker nodes.

## Image Management for AWS

### Push Images to ECR

```bash
# Create ECR repositories
aws ecr create-repository --repository-name moni-be --region your-region
aws ecr create-repository --repository-name moni-fe --region your-region

# Get login token
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.your-region.amazonaws.com

# Build and tag images
docker build -t moni-be-slim:latest -f Dockerfile .
docker tag moni-be-slim:latest your-account.dkr.ecr.your-region.amazonaws.com/moni-be:latest

cd FE/moni-fe
docker build -t moni-fe:latest .
docker tag moni-fe:latest your-account.dkr.ecr.your-region.amazonaws.com/moni-fe:latest

# Push images
docker push your-account.dkr.ecr.your-region.amazonaws.com/moni-be:latest
docker push your-account.dkr.ecr.your-region.amazonaws.com/moni-fe:latest
```

## Security Considerations

### 1. Database Password Management

```bash
# Create a proper secret (don't use the default one!)
kubectl create secret generic moni-db-secret \
  --from-literal=password='your-secure-password' \
  -n moni
```

### 2. HTTPS/SSL Configuration

Update `ingress.yaml` to include SSL:

```yaml
annotations:
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:region:account:certificate/cert-id
  alb.ingress.kubernetes.io/ssl-redirect: '443'
```

### 3. Network Security

- Use AWS Security Groups to restrict database access
- Consider using AWS RDS instead of in-cluster PostgreSQL for production
- Set up VPC and subnet configurations appropriately

## Cost Optimization

1. **Use AWS RDS** instead of self-managed PostgreSQL
2. **Use AWS EFS** for shared storage if needed
3. **Configure HPA** (Horizontal Pod Autoscaler) for auto-scaling
4. **Use Spot instances** for worker nodes

## Monitoring and Logging

```bash
# Deploy AWS CloudWatch Container Insights
curl https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluentd-quickstart.yaml | sed "s/{{cluster_name}}/your-cluster-name/;s/{{region_name}}/your-region/" | kubectl apply -f -
```

## Production Checklist

- [ ] Images pushed to ECR
- [ ] Database password changed from default
- [ ] SSL certificate configured
- [ ] Health checks configured
- [ ] Resource limits set
- [ ] Monitoring enabled
- [ ] Backup strategy for database
- [ ] CI/CD pipeline for updates

## Access Your Application

After deployment, access your application at:
- **LoadBalancer**: Check `kubectl get svc -n moni` for EXTERNAL-IP
- **Ingress**: Check `kubectl get ingress -n moni` for ADDRESS
- **Custom Domain**: Configure Route53 to point to your load balancer