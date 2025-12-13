# Kubernetes Learning Guide - K3s on EC2

This folder contains everything you need to learn Kubernetes by deploying the Moni application on a K3s cluster running on AWS EC2.

## 🎯 What You'll Learn

- Kubernetes core concepts (Pods, Deployments, Services, Namespaces)
- K3s (lightweight Kubernetes) installation and management
- Terraform for infrastructure as code
- Container registry integration (AWS ECR)
- Kubernetes networking (ClusterIP, NodePort, LoadBalancer)
- Health checks and probes
- Persistent storage with PersistentVolumeClaims
- `kubectl` commands for cluster management

---

## 📁 Folder Structure

```
k8s-dev/
├── README.md                 # This guide
├── terraform/                # Infrastructure as Code
│   ├── main.tf              # AWS provider configuration
│   ├── variables.tf         # Configurable variables
│   ├── ec2.tf               # EC2 instance with K3s
│   ├── networking.tf        # VPC, subnets, security groups
│   ├── iam.tf               # IAM roles for ECR access
│   ├── ssh-keys.tf          # SSH key management
│   ├── outputs.tf           # Deployment outputs
│   ├── user-data.sh         # K3s installation script
│   └── terraform.tfvars.example
├── manifests/               # Kubernetes manifests
│   └── moni-app.yaml        # Complete application deployment
└── scripts/                 # Helper scripts
    ├── deploy-k8s.sh        # Deploy app to K3s
    ├── manage-k8s.sh        # Manage K3s cluster
    └── setup-local-kubectl.sh  # Configure kubectl locally
```

---

## 🚀 Step-by-Step Guide

### Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** installed (v1.0+)
3. **kubectl** installed locally
4. **Docker images** pushed to ECR (via GitHub Actions)

### Step 1: Deploy EC2 with K3s

```bash
cd k8s-dev/terraform

# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Deploy the infrastructure
terraform apply
```

This creates:
- VPC with public subnet
- EC2 instance (t4g.small ARM64)
- K3s installation
- Security groups (SSH, HTTP, HTTPS, K3s API, NodePorts)
- IAM role for ECR access

### Step 2: Get Deployment Information

After Terraform completes:

```bash
# Get the instance IP
terraform output instance_public_ip

# Get the SSH command
terraform output ssh_command

# Get the kubeconfig
terraform output -raw kubeconfig_path
```

### Step 3: Configure Local kubectl (Optional)

To manage the cluster from your local machine:

```bash
# Run the setup script
../scripts/setup-local-kubectl.sh

# Or manually:
export KUBECONFIG=./kubeconfig
kubectl get nodes
```

### Step 4: Deploy the Application

#### Option A: From Your Local Machine

```bash
cd k8s-dev/scripts
./deploy-k8s.sh <EC2_IP>
```

#### Option B: SSH into EC2 and Deploy

```bash
# SSH to EC2
ssh -i ./moni-dev-k3s-key.pem ec2-user@<EC2_IP>

# Deploy the application
~/deploy-moni.sh
```

### Step 5: Verify Deployment

```bash
# Check nodes
kubectl get nodes

# Check all resources in moni namespace
kubectl get all -n moni

# Check pods are running
kubectl get pods -n moni

# Check services
kubectl get svc -n moni
```

### Step 6: Access the Application

```bash
# Get NodePort URLs
kubectl get svc -n moni

# Access:
# Frontend: http://<EC2_IP>:30081
# Backend:  http://<EC2_IP>:30080
```

---

## 📚 Kubernetes Concepts Explained

### Pods
The smallest deployable unit in Kubernetes. Each pod contains one or more containers.

```bash
# List pods
kubectl get pods -n moni

# Describe a pod
kubectl describe pod <pod-name> -n moni

# View pod logs
kubectl logs <pod-name> -n moni

# Execute command in pod
kubectl exec -it <pod-name> -n moni -- /bin/sh
```

### Deployments
Manage the desired state of your application (replicas, updates, rollbacks).

```bash
# List deployments
kubectl get deployments -n moni

# Scale a deployment
kubectl scale deployment moni-be --replicas=3 -n moni

# Update image
kubectl set image deployment/moni-be moni-be=<new-image> -n moni

# Rollback
kubectl rollout undo deployment/moni-be -n moni
```

### Services
Expose your pods to the network.

- **ClusterIP**: Internal only (default)
- **NodePort**: Exposes on each node's IP at a static port
- **LoadBalancer**: Creates external load balancer (cloud provider)

```bash
# List services
kubectl get svc -n moni

# Describe a service
kubectl describe svc moni-fe -n moni
```

### Namespaces
Logical isolation for resources.

```bash
# List namespaces
kubectl get namespaces

# Set default namespace
kubectl config set-context --current --namespace=moni
```

### Secrets
Store sensitive data like passwords.

```bash
# List secrets
kubectl get secrets -n moni

# Create a secret
kubectl create secret generic my-secret --from-literal=password=mypassword -n moni

# Decode a secret
kubectl get secret moni-db-secret -n moni -o jsonpath='{.data.password}' | base64 -d
```

### Persistent Volumes
Storage that survives pod restarts.

```bash
# List PVCs
kubectl get pvc -n moni

# Describe PVC
kubectl describe pvc moni-pvc -n moni
```

---

## 🔧 Common kubectl Commands

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes
kubectl version

# Resource management
kubectl get all -n moni
kubectl get pods,svc,deployments -n moni
kubectl describe <resource> <name> -n moni

# Logs and debugging
kubectl logs <pod-name> -n moni
kubectl logs -f <pod-name> -n moni  # follow
kubectl logs -l app=moni-be -n moni  # by label

# Execute commands
kubectl exec -it <pod-name> -n moni -- /bin/sh
kubectl exec <pod-name> -n moni -- env

# Port forwarding (local access)
kubectl port-forward svc/moni-be 8080:8080 -n moni
kubectl port-forward svc/moni-fe 3000:80 -n moni

# Apply/delete manifests
kubectl apply -f manifests/moni-app.yaml
kubectl delete -f manifests/moni-app.yaml

# Restart deployment
kubectl rollout restart deployment/moni-be -n moni
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS EC2 Instance                      │
│                     (t4g.small - ARM64)                     │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    K3s Cluster                         │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Namespace: moni                     │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │  │
│  │  │  │ moni-fe  │  │ moni-be  │  │   moni-db    │  │  │  │
│  │  │  │ (nginx)  │→ │ (Spring) │→ │ (PostgreSQL) │  │  │  │
│  │  │  │ :80      │  │ :8080    │  │ :5432        │  │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────────┘  │  │  │
│  │  │       ↓              ↓                          │  │  │
│  │  │  NodePort:30081  NodePort:30080                 │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌─────────────────────────────────────────┐   │  │  │
│  │  │  │   PVC: moni-pvc (PostgreSQL data)       │   │  │  │
│  │  │  └─────────────────────────────────────────┘   │  │  │
│  │  │                                                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    Internet Access via
                    Ports 30080, 30081
```

---

## 🔍 Troubleshooting

### K3s Not Starting

```bash
# Check K3s status
sudo systemctl status k3s

# View K3s logs
sudo journalctl -u k3s -f

# Check cloud-init logs
sudo cat /var/log/cloud-init-output.log
```

### Pods Not Starting

```bash
# Describe the pod for errors
kubectl describe pod <pod-name> -n moni

# Check events
kubectl get events -n moni --sort-by='.lastTimestamp'

# Check if images can be pulled
kubectl logs <pod-name> -n moni
```

### Image Pull Errors

```bash
# On EC2, authenticate to ECR
aws ecr get-login-password --region eu-central-1 | sudo k3s crictl login --username AWS --password-stdin 026596707189.dkr.ecr.eu-central-1.amazonaws.com

# Create imagePullSecret if needed
kubectl create secret docker-registry ecr-secret \
  --docker-server=026596707189.dkr.ecr.eu-central-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region eu-central-1) \
  -n moni
```

### Database Connection Issues

```bash
# Check database pod
kubectl get pods -l app=moni-db -n moni
kubectl logs -l app=moni-db -n moni

# Test database connectivity from backend pod
kubectl exec -it <backend-pod> -n moni -- nc -zv moni-db 5432
```

---

## 🧹 Cleanup

### Delete Application Only

```bash
kubectl delete -f manifests/moni-app.yaml
```

### Delete Everything (Terraform)

```bash
cd terraform
terraform destroy
```

---

## 📖 Further Learning

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [K3s Documentation](https://docs.k3s.io/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Patterns](https://k8spatterns.io/)

---

## ⚡ Quick Reference

| Action | Command |
|--------|---------|
| List pods | `kubectl get pods -n moni` |
| Pod logs | `kubectl logs <pod> -n moni` |
| Describe pod | `kubectl describe pod <pod> -n moni` |
| Scale deployment | `kubectl scale deploy <name> --replicas=N -n moni` |
| Restart deployment | `kubectl rollout restart deploy <name> -n moni` |
| Port forward | `kubectl port-forward svc/<svc> <local>:<remote> -n moni` |
| Execute in pod | `kubectl exec -it <pod> -n moni -- /bin/sh` |
| Apply manifest | `kubectl apply -f <file>` |
| Delete manifest | `kubectl delete -f <file>` |
