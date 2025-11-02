# 🚀 GitHub Actions CI/CD Setup Guide

## 📋 Overview

This GitHub Actions workflow automatically builds and pushes Docker images for both your backend (Spring Boot) and frontend (Vue.js) to Amazon ECR whenever you push to the main branch.

## 🔧 Required GitHub Secrets

You need to add these secrets to your GitHub repository for the workflow to access AWS ECR:

### 1. Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/pecca86/moniV2`
2. Click on **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### 2. Add Required Secrets

#### `AWS_ACCESS_KEY_ID`
- **Name:** `AWS_ACCESS_KEY_ID`
- **Value:** Your AWS access key ID
- **How to get:** From AWS IAM Console → Users → Your User → Security credentials

#### `AWS_SECRET_ACCESS_KEY`  
- **Name:** `AWS_SECRET_ACCESS_KEY`
- **Value:** Your AWS secret access key
- **How to get:** From AWS IAM Console (created when you made the access key)

## 🛡️ AWS IAM Permissions

Your AWS user needs these ECR permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": [
                "arn:aws:ecr:eu-central-1:026596707189:repository/moni-be",
                "arn:aws:ecr:eu-central-1:026596707189:repository/moni-fe"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🔄 Workflow Triggers

The workflow runs when:
- ✅ **Push to main branch** - Builds and pushes images
- ✅ **Pull request to main** - Builds images for testing (doesn't push)

## 🏗️ What the Workflow Does

### 🔨 Build Process:
1. **Checkout code** from your repository
2. **Configure AWS credentials** using GitHub secrets
3. **Login to ECR** using AWS CLI
4. **Set up Java 21** for Spring Boot backend
5. **Set up Node.js 18** for Vue.js frontend
6. **Cache dependencies** (Maven & npm) for faster builds
7. **Build Spring Boot JAR** using Maven
8. **Build Vue.js frontend** using npm
9. **Build Docker images** for both services
10. **Push images to ECR** with both `latest` and commit SHA tags

### 🐳 Docker Images Created:
- **Backend:** `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-be:latest`
- **Backend SHA:** `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-be:<commit-sha>`
- **Frontend:** `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-fe:latest`
- **Frontend SHA:** `026596707189.dkr.ecr.eu-central-1.amazonaws.com/moni-fe:<commit-sha>`

## 📊 Build Output

After each successful build, you'll see:
- ✅ **GitHub Actions Summary** with image URIs
- ✅ **Build logs** showing each step
- ✅ **Image tags** with both latest and commit SHA
- ✅ **Next steps** for deployment

## 🚀 Deployment Integration

After images are built, update your deployment:

```bash
# Update your running application with latest images
cd terraform-ec2
./manage-app.sh <EC2_IP> update
```

## 🔍 Monitoring

### Build Status Badge
Add this to your README.md to show build status:
```markdown
![Build Status](https://github.com/pecca86/moniV2/workflows/Build%20and%20Push%20Docker%20Images%20to%20ECR/badge.svg)
```

### Checking Builds
- **GitHub Actions tab** in your repository shows all workflow runs
- **ECR Console** in AWS shows your pushed images
- **Commit status** shows build success/failure

## 🛠️ Troubleshooting

### Common Issues:

#### 1. **AWS Credentials Error**
```
Error: Unable to locate credentials
```
**Solution:** Check that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets are set correctly.

#### 2. **ECR Permission Denied**
```
Error: denied: User is not authorized to perform ecr:BatchCheckLayerAvailability
```
**Solution:** Add the ECR IAM permissions listed above to your AWS user.

#### 3. **Maven Build Failure**
```
Error: Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin
```
**Solution:** Check Java version compatibility in your `pom.xml`.

#### 4. **Frontend Build Failure**
```
Error: npm ERR! code ELIFECYCLE
```
**Solution:** Check your `package.json` scripts and dependencies.

## 🔄 Workflow Customization

### Change Trigger Branches
Edit `.github/workflows/build-and-push.yml`:
```yaml
on:
  push:
    branches: [ main, develop ]  # Add more branches
```

### Add Environment Variables
```yaml
env:
  CUSTOM_ENV_VAR: "your-value"
```

### Skip Tests During Build
The workflow already includes `-DskipTests` for faster builds. To include tests:
```yaml
- name: Run Tests
  run: ./mvnw test
```

## 📈 Advanced Features

### Conditional Builds
Build only when specific files change:
```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'FE/**'
      - 'Dockerfile*'
```

### Multi-Environment Deployment
Use different ECR repositories for staging/production based on branch.

---

## ✅ Setup Checklist

- [ ] Add `AWS_ACCESS_KEY_ID` secret to GitHub
- [ ] Add `AWS_SECRET_ACCESS_KEY` secret to GitHub  
- [ ] Verify ECR repositories exist (`moni-be`, `moni-fe`)
- [ ] Ensure AWS user has ECR permissions
- [ ] Push to main branch to trigger first build
- [ ] Check GitHub Actions tab for build status
- [ ] Verify images appear in ECR console

🎉 **Once setup is complete, every push to main will automatically build and deploy your latest images!**