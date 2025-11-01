# AWS EKS Deployment Guide for Moni Application

This guide shows how to deploy your Moni application to AWS EKS without needing `kubectl port-forward`.

## Prerequisites

1. **EKS Cluster**: Running Amazon EKS cluster
2. **kubectl**: Configured to connect to your EKS cluster
3. **ECR Repositories**: For storing Docker images
4. **AWS CLI**: Configured with appropriate permissions

## Deployment Options

### Option 1: LoadBalancer Service (Recommended for Simplicity)

This creates an AWS Network Load Balancer automatically.

#### Step 1: Push Images to ECR

```bash
# Create ECR repositories (if not already created)
aws ecr create-repository --repository-name moni-be --region us-west-2
aws ecr create-repository --repository-name moni-fe --region us-west-2

# Get login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-west-2.amazonaws.com

# Build and push backend image
docker build -t moni-be-slim:latest -f Dockerfile .
docker tag moni-be-slim:latest YOUR_ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/moni-be:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/moni-be:latest

# Build and push frontend image
cd FE/moni-fe
docker build -t moni-fe:latest .
docker tag moni-fe:latest YOUR_ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/moni-fe:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/moni-fe:latest
cd ../..
```

#### Step 2: Update Image References

Edit `base/Moni-aws.yaml` and replace:
- `YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/moni-be:latest`
- `YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/moni-fe:latest`

With your actual ECR repository URLs.

#### Step 3: Deploy to EKS

```bash
# Deploy the application
kubectl apply -f base/Moni-aws.yaml

# Wait for the load balancer to be created (may take 2-3 minutes)
kubectl get svc -n moni -w

# Get the external URL
kubectl get svc moni-fe -n moni
```

The `EXTERNAL-IP` column will show your Load Balancer DNS name. Access your app at:
`http://YOUR_LOAD_BALANCER_DNS_NAME`

### Option 2: Application Load Balancer with Ingress (More Advanced)

This approach uses AWS Application Load Balancer for better features and cost optimization.

#### Step 1: Install AWS Load Balancer Controller

```bash
# Add the EKS chart repo
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Install AWS Load Balancer Controller
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=YOUR_CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

#### Step 2: Modify Services for Ingress

First, change the frontend service in `Moni-aws.yaml` to `ClusterIP`:

```yaml
# Frontend Service - ClusterIP for Ingress
apiVersion: v1
kind: Service
metadata:
  name: moni-fe
  namespace: moni
spec:
  type: ClusterIP  # Changed from LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: moni-fe
```

#### Step 3: Deploy Application and Ingress

```bash
# Deploy the application (with modified ClusterIP service)
kubectl apply -f base/Moni-aws.yaml

# Deploy the Ingress
kubectl apply -f base/aws-ingress.yaml

# Check Ingress status
kubectl get ingress -n moni
```

Access your app using the ALB DNS name from the ingress.

## Security Configuration

### 1. Change Database Password

```bash
# Generate a secure password
SECURE_PASSWORD=$(openssl rand -base64 32)

# Create secret with secure password
kubectl create secret generic moni-db-secret \
  --from-literal=password="$SECURE_PASSWORD" \
  -n moni --dry-run=client -o yaml | kubectl apply -f -

echo "Database password set to: $SECURE_PASSWORD"
# Save this password securely!
```

### 2. Configure SSL/TLS (Optional but Recommended)

1. Request an SSL certificate in AWS Certificate Manager
2. Update the ingress annotations with your certificate ARN:

```yaml
annotations:
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:REGION:ACCOUNT:certificate/CERT_ID
  alb.ingress.kubernetes.io/ssl-redirect: '443'
```

## Monitoring and Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n moni
kubectl describe pod POD_NAME -n moni
kubectl logs POD_NAME -n moni
```

### Check Service Status
```bash
kubectl get svc -n moni
kubectl describe svc moni-fe -n moni
```

### Check Ingress Status
```bash
kubectl get ingress -n moni
kubectl describe ingress moni-ingress -n moni
```

## Cost Optimization Tips

1. **Use Spot Instances**: For EKS worker nodes to reduce costs
2. **Right-size Resources**: Adjust CPU/memory requests based on actual usage
3. **Use HPA**: Horizontal Pod Autoscaler for automatic scaling
4. **Consider RDS**: Use AWS RDS instead of self-managed PostgreSQL for production

## Comparison with Local Setup

| Local (Kind) | AWS EKS |
|--------------|---------|
| `kubectl port-forward` | Load Balancer DNS/IP |
| Local storage | AWS EBS volumes |
| Development images | ECR container registry |
| No SSL | SSL via Certificate Manager |
| Single node | Multi-AZ high availability |

## Next Steps

1. Set up CI/CD pipeline for automatic deployments
2. Configure monitoring with CloudWatch
3. Set up backup strategy for database
4. Configure Route53 for custom domain
5. Implement proper logging and alerting

Your application will be accessible without any port-forwarding once deployed!