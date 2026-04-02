# K3s on EC2 — Moni Deployment Guide

This folder contains the infrastructure and Kubernetes manifests for running the Moni application on a K3s cluster on AWS EC2.

---

## Folder Structure

```
k8s-dev/
├── README.md                     # This guide
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                  # AWS provider and AMI lookup
│   ├── variables.tf             # Configurable variables
│   ├── ec2.tf                   # EC2 instance definition
│   ├── networking.tf            # VPC, subnet, security groups
│   ├── iam.tf                   # IAM roles (ECR + SSM access)
│   ├── ssh-keys.tf              # SSH key pair generation
│   ├── outputs.tf               # Deployment outputs
│   ├── user-data.sh             # K3s bootstrap script
│   └── terraform.tfvars.example # Variable template
├── manifests/
│   └── moni-app.yaml            # All Kubernetes resources
└── scripts/                     # Manual / local management
    ├── deploy-k8s.sh            # Deploy app from local machine
    ├── manage-k8s.sh            # Cluster management helpers
    ├── setup-local-kubectl.sh   # Configure local kubectl
    └── migrate-to-k3s.sh        # One-time migration helper
```

---

## CI/CD Pipeline (Automated Deployment)

Deployments happen automatically on every push to `main` via two GitHub Actions workflows.

### Skipping the pipeline

To push to `main` without triggering a build (e.g. documentation-only changes), add `[skip ci]` to your commit message:

```bash
git commit -m "update documentation [skip ci]"
```

GitHub Actions also recognises `[ci skip]`, `[no ci]`, and `[skip actions]`.

### Workflow 1 — Build and Push (`build-and-push.yml`)

Triggered on: push or PR to `main`

1. Builds the Spring Boot JAR (`mvn clean package`)
2. Builds the React frontend (`npm ci && npm run build`)
3. Builds multi-platform Docker images (linux/amd64 + linux/arm64)
4. Pushes to ECR with two tags: `latest` and `<git-sha>`

ECR repositories:
- Backend: `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni/moni-be`
- Frontend: `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni/moni-fe`

### Workflow 2 — Deploy to EC2 (`deploy-to-ec2.yml`)

Triggered on: successful completion of Workflow 1

1. Looks up the running EC2 instance by tag `Name=moni-dev-k3s`
2. Sends a shell script to the instance via **AWS SSM** (no SSH required)
3. On the instance the script:
   - Refreshes the ECR pull secret
   - Applies `moni-app.yaml` via `kubectl apply`
   - Updates the backend and frontend images to the new SHA tag
   - Waits for both rollouts to complete (`kubectl rollout status`)
4. Verifies the deployment by hitting the health endpoint

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user key (created by Terraform) |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret (created by Terraform) |

Get the values after `terraform apply`:
```bash
terraform output -json github_actions_credentials
```

---

## Initial Infrastructure Setup (One-Time)

The EC2 instance and all supporting AWS resources are managed by Terraform. This only needs to be done once (or after `terraform destroy`).

### Prerequisites

- AWS CLI configured
- Terraform v1.0+
- `kubectl` installed locally (optional, for manual access)

### Deploy

```bash
cd k8s-dev/terraform

terraform init
terraform plan
terraform apply
```

This creates:
- VPC, public subnet, internet gateway, route tables
- Security group (SSH from your IP, HTTP/HTTPS/NodePorts from anywhere)
- EC2 t4g.small ARM64 instance with K3s pre-installed
- IAM role with ECR pull and SSM Session Manager access
- SSH key pair (saved as `moni-dev-k3s-key.pem` in the terraform directory)

K3s installation takes **5–10 minutes** after the instance starts. Progress is logged to `/var/log/user-data.log` on the instance.

### Useful Outputs

```bash
terraform output instance_public_ip   # EC2 public IP
terraform output ssh_command          # Ready-to-use SSH command
terraform output -json github_actions_credentials  # CI/CD secrets
```

---

## SSH Access

```bash
ssh -i k8s-dev/terraform/moni-dev-k3s-key.pem ec2-user@<EC2_IP>
```

SSH is restricted to the IP defined in `allowed_ssh_cidr` in `variables.tf`. Update this if your IP changes and run `terraform apply`.

## SSM Session Manager Access

You can also connect without SSH via the AWS Console:
EC2 → Instance → Connect → Session Manager tab.

---

## Manual Deployment (Local)

The automated pipeline handles deployments on push. Use the scripts below for manual intervention or first-time setup.

### Set Up Local kubectl

```bash
cd k8s-dev/scripts
./setup-local-kubectl.sh
# or manually:
export KUBECONFIG=k8s-dev/terraform/kubeconfig
kubectl get nodes
```

### Deploy / Re-deploy Application

```bash
cd k8s-dev/scripts
./deploy-k8s.sh <EC2_IP>
```

This applies `manifests/moni-app.yaml` and waits for all deployments to become ready.

---

## Application Access

| Service | URL |
|---------|-----|
| Frontend | `http://<EC2_IP>:30081` |
| Backend API | `http://<EC2_IP>:30080` |
| Backend health | `http://<EC2_IP>:30080/actuator/health` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS EC2 (t4g.small ARM64)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   K3s Cluster                        │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │             Namespace: moni                    │  │   │
│  │  │                                                │  │   │
│  │  │  moni-fe (React/nginx)  → NodePort 30081       │  │   │
│  │  │       ↓                                        │  │   │
│  │  │  moni-be (Spring Boot)  → NodePort 30080       │  │   │
│  │  │       ↓                                        │  │   │
│  │  │  moni-db (PostgreSQL 16) — ClusterIP only      │  │   │
│  │  │       ↓                                        │  │   │
│  │  │  PVC: moni-pvc (5Gi, local-path)               │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑ Images pulled from AWS ECR on every deploy
```

---

## Common kubectl Commands

```bash
# Cluster status
kubectl get nodes
kubectl get all -n moni

# Pod management
kubectl get pods -n moni
kubectl describe pod <pod-name> -n moni
kubectl logs <pod-name> -n moni
kubectl logs -f <pod-name> -n moni          # follow
kubectl logs -l app=moni-be -n moni         # by label

# Deployments
kubectl get deployments -n moni
kubectl rollout status deployment/moni-be -n moni
kubectl rollout restart deployment/moni-be -n moni
kubectl rollout undo deployment/moni-be -n moni

# Exec into a pod
kubectl exec -it <pod-name> -n moni -- /bin/sh

# Port forwarding (local access without NodePort)
kubectl port-forward svc/moni-be 8080:8080 -n moni
kubectl port-forward svc/moni-fe 3000:80 -n moni

# Secrets
kubectl get secrets -n moni
kubectl get secret moni-db-secret -n moni -o jsonpath='{.data.password}' | base64 -d

# Storage
kubectl get pvc -n moni
```

---

## Troubleshooting

### K3s not starting after instance launch

```bash
# Check bootstrap log
sudo cat /var/log/user-data.log

# Check K3s service
sudo systemctl status k3s
sudo journalctl -u k3s -f
```

### SSM Session Manager shows offline

```bash
sudo systemctl status amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
```

Wait ~60 seconds and refresh Fleet Manager in the AWS console.

### Pods not starting / ImagePullBackOff

```bash
kubectl describe pod <pod-name> -n moni
kubectl get events -n moni --sort-by='.lastTimestamp'

# Manually refresh ECR pull secret on the instance
aws ecr get-login-password --region eu-central-1 | \
  kubectl create secret docker-registry ecr-pull-secret \
  --docker-server=026596707189.dkr.ecr.eu-central-1.amazonaws.com \
  --docker-username=AWS --docker-password-stdin \
  -n moni --dry-run=client -o yaml | kubectl apply -f -
```

### Database connection issues

```bash
kubectl get pods -l app=moni-db -n moni
kubectl logs -l app=moni-db -n moni

# Test connectivity from backend pod
kubectl exec -it <backend-pod> -n moni -- nc -zv moni-db 5432
```

### GitHub Actions deploy step timing out

The SSM command timeout is 600 seconds. If rollouts consistently time out, check pod events for image pull or resource issues on the instance.

---

## Cleanup

```bash
# Remove application only (preserves infrastructure)
kubectl delete -f k8s-dev/manifests/moni-app.yaml

# Destroy everything
cd k8s-dev/terraform
terraform destroy
```
