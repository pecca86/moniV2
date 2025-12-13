# 🚀 Complete CI/CD Pipeline Summary

## 📋 Overview

This project uses GitHub Actions for continuous integration and **automated deployment** to an EC2-hosted K3s cluster.

## 🔄 Workflows

### 1. Build and Push (`build-and-push.yml`)
**Trigger:** Push to `main` branch

**What it does:**
1. ✅ Builds the Spring Boot backend JAR (Java 21)
2. ✅ Builds the React/Vite frontend
3. ✅ Creates multi-architecture Docker images (amd64/arm64)
4. ✅ Pushes images to AWS ECR with `latest` and commit SHA tags

### 2. Deploy to EC2 (`deploy-to-ec2.yml`)
**Trigger:** Automatically after successful build, or manual trigger

**What it does:**
1. ✅ Connects to EC2 instance via SSH
2. ✅ Re-authenticates with ECR
3. ✅ Restarts **only** the Backend and Frontend deployments
4. ✅ **Preserves the PostgreSQL database** (no restart, no data loss!)
5. ✅ Verifies deployment health
6. ✅ Creates deployment summary

## 🔐 Required GitHub Secrets

Add these secrets in your repository settings (`Settings > Secrets and variables > Actions`):

| Secret | Description | Required |
|--------|-------------|----------|
| `AWS_ACCESS_KEY_ID` | AWS access key for ECR | ✅ Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | ✅ Yes |
| `EC2_SSH_PRIVATE_KEY` | Private SSH key (.pem contents) | ✅ Yes |
| `EC2_INSTANCE_IP` | EC2 IP (if auto-detection fails) | Optional |

### Setting up the SSH Key Secret

1. Get your EC2 SSH private key (the `.pem` file)
2. Go to GitHub repo → Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EC2_SSH_PRIVATE_KEY`
5. Value: Paste the **entire contents** of your `.pem` file:
   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   ...
   -----END RSA PRIVATE KEY-----
   ```

## 📊 Deployment Flow

```
Push to main
     │
     ▼
┌─────────────────────────────┐
│  Build and Push Workflow    │
│  - Build JAR (Java 21)      │
│  - Build Docker images      │
│  - Push to ECR              │
└─────────────────────────────┘
     │ (on success)
     ▼
┌─────────────────────────────┐
│  Deploy to EC2 Workflow     │
│  - SSH to EC2               │
│  - kubectl rollout restart  │
│    (BE and FE only!)        │
│  - Verify health            │
└─────────────────────────────┘
     │
     ▼
  ✅ Live on EC2!
```

## 🛡️ Database Safety

The deployment workflow **only restarts** these deployments:
- ✅ `moni-be` (Backend) - **Updated**
- ✅ `moni-fe` (Frontend) - **Updated**

The database is **never touched**:
- ❌ `moni-db` (PostgreSQL) - **NOT restarted**
- ✅ Your data is safe
- ✅ No connection interruptions
- ✅ Persistent storage via PersistentVolumeClaim

## 🖐️ Manual Deployment

You can trigger deployment manually without pushing code:

**Option 1: GitHub UI**
1. Go to Actions tab in GitHub
2. Select "Deploy to EC2 K3s Cluster"
3. Click "Run workflow"

**Option 2: GitHub CLI**
```bash
gh workflow run deploy-to-ec2.yml
```

## 🌐 Access URLs (after deployment)

| Service | URL |
|---------|-----|
| Frontend | `http://<EC2_IP>:30081` |
| Backend API | `http://<EC2_IP>:30080` |
| Health Check | `http://<EC2_IP>:30080/actuator/health` |

## ⚡ Quick Start

1. **Add secrets** to GitHub repository (see above)
2. **Push to main** - workflow triggers automatically
3. **Check Actions tab** for deployment status
4. **Access your app** at the URLs above

That's it! Every push to `main` will automatically deploy your changes to EC2.
