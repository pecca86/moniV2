# Local Kubernetes Development with K3d

This folder contains everything you need to run the Moni application on a local Kubernetes cluster using **k3d** (K3s in Docker).

## 🎯 Why K3d for Local Development?

- **Lightweight**: K3d runs K3s inside Docker containers
- **Fast**: Cluster creation takes ~30 seconds
- **Compatible**: Same K3s distribution as your EC2 setup
- **Multi-node**: Can simulate multi-node clusters locally
- **Registry**: Built-in local container registry support

---

## 📁 Folder Structure

```
k8s-dev-local/
├── README.md                    # This guide
├── scripts/
│   ├── setup.sh                 # One-time setup (install k3d, kubectl)
│   ├── cluster-create.sh        # Create local K3d cluster
│   ├── cluster-delete.sh        # Delete the cluster
│   ├── build-and-load.sh        # Build images and load into cluster
│   ├── deploy.sh                # Deploy application to cluster
│   ├── status.sh                # Check cluster and app status
│   └── logs.sh                  # View application logs
├── manifests/
│   └── moni-app-local.yaml      # Kubernetes manifests for local dev
└── k3d-config.yaml              # K3d cluster configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** installed and running
- **macOS/Linux** terminal

### Step 1: Initial Setup (One-time)

```bash
cd k8s-dev-local

# Install k3d, kubectl, and other tools
./scripts/setup.sh
```

### Step 2: Create Local Cluster

```bash
# Creates a K3d cluster with local registry
./scripts/cluster-create.sh
```

This creates:
- A K3d cluster named `moni-local`
- A local Docker registry at `localhost:5050`
- Port mappings for accessing the application

### Step 3: Build and Load Images

```bash
# Build Docker images and load them into the cluster
./scripts/build-and-load.sh
```

### Step 4: Deploy the Application

```bash
# Deploy all Kubernetes resources
./scripts/deploy.sh
```

### Step 5: Access the Application

After deployment:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8081

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `./scripts/setup.sh` | Install required tools (k3d, kubectl) |
| `./scripts/cluster-create.sh` | Create the K3d cluster |
| `./scripts/cluster-delete.sh` | Delete the cluster |
| `./scripts/build-and-load.sh` | Build and load Docker images |
| `./scripts/deploy.sh` | Deploy application to cluster |
| `./scripts/restart.sh [be\|fe]` | Rebuild and restart a component |
| `./scripts/status.sh` | Show cluster and application status |
| `./scripts/logs.sh [be\|fe\|db]` | View application logs |

### Build Options

```bash
# Default: Build JAR locally, then Docker image (faster)
./scripts/build-and-load.sh

# Alternative: Full Docker build (no local Java/Maven needed)
USE_DOCKER_BUILD=true ./scripts/build-and-load.sh

# Build only backend
./scripts/build-and-load.sh --backend-only

# Build only frontend
./scripts/build-and-load.sh --frontend-only
```

---

## 📖 Common Workflows

### Full Fresh Start

```bash
./scripts/cluster-delete.sh  # Remove existing cluster (if any)
./scripts/cluster-create.sh  # Create new cluster
./scripts/build-and-load.sh  # Build and load images
./scripts/deploy.sh          # Deploy application
```

### Rebuild and Redeploy Backend

```bash
# After making code changes
./scripts/build-and-load.sh --backend-only
kubectl rollout restart deployment/moni-be -n moni
```

### Rebuild and Redeploy Frontend

```bash
# After making frontend changes
./scripts/build-and-load.sh --frontend-only
kubectl rollout restart deployment/moni-fe -n moni
```

### View All Pods

```bash
kubectl get pods -n moni -w  # Watch mode
```

### Access PostgreSQL

```bash
# Port forward to access DB locally
kubectl port-forward svc/moni-db 5432:5432 -n moni

# Then connect with psql or any DB tool
psql -h localhost -U postgres -d moni
```

### View Logs

```bash
# All backend logs
./scripts/logs.sh be

# All frontend logs
./scripts/logs.sh fe

# Database logs
./scripts/logs.sh db

# Follow logs in real-time
kubectl logs -f deployment/moni-be -n moni
```

### Shell into a Pod

```bash
# Backend pod
kubectl exec -it deployment/moni-be -n moni -- /bin/sh

# Database pod
kubectl exec -it deployment/moni-db -n moni -- psql -U postgres -d moni
```

---

## 🆚 Local vs EC2 Deployment

| Aspect | Local (k3d) | EC2 (k3s) |
|--------|-------------|-----------|
| Images | Built locally, loaded into cluster | Pulled from ECR |
| Registry | Local registry (localhost:5050) | AWS ECR |
| Storage | Docker volumes | EC2 EBS |
| Access | localhost ports | EC2 public IP |
| Cost | Free | EC2 instance cost |
| Use Case | Development, testing | Production-like environment |

---

## 🐛 Troubleshooting

### Docker Not Running

```bash
# Make sure Docker Desktop is running
docker info
```

### Cluster Won't Start

```bash
# Check k3d logs
docker logs k3d-moni-local-server-0

# Delete and recreate
./scripts/cluster-delete.sh
./scripts/cluster-create.sh
```

### Images Not Loading

```bash
# Check if images exist
docker images | grep moni

# Manually import an image
k3d image import moni-be:local -c moni-local
```

### Pods in CrashLoopBackOff

```bash
# Check pod events
kubectl describe pod <pod-name> -n moni

# Check logs
kubectl logs <pod-name> -n moni --previous
```

### Cannot Access Application

```bash
# Check if services are running
kubectl get svc -n moni

# Check port mappings
docker ps | grep k3d-moni-local

# Verify ingress
kubectl get ingress -n moni
```

---

## 🧹 Cleanup

```bash
# Delete the cluster (keeps Docker images)
./scripts/cluster-delete.sh

# Also remove built images
docker rmi moni-be:local moni-fe:local
```

---

## 🔗 Useful Links

- [K3d Documentation](https://k3d.io/)
- [K3s Documentation](https://docs.k3s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
