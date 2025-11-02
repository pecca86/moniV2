# Moni Application - Simplified Deployment Guide

This guide covers the optimized deployment approach using template files instead of inline configuration generation.

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured with appropriate permissions
- SSH access to EC2 instance
- Docker images built and pushed to ECR

### Deploy Application
```bash
# Deploy using existing configuration templates
./deploy-simple.sh <EC2_IP>

# Example:
./deploy-simple.sh 3.72.52.245
```

### Manage Application
```bash
# Check status
./manage-app.sh <EC2_IP> status

# View logs
./manage-app.sh <EC2_IP> logs

# Restart services
./manage-app.sh <EC2_IP> restart

# Update to latest images
./manage-app.sh <EC2_IP> update

# Run validation tests
./manage-app.sh <EC2_IP> test
```

## 📁 File Structure

### Configuration Templates
```
terraform-ec2/
├── deploy-simple.sh              # Main deployment script
├── manage-app.sh                 # Application management
├── validate-deployment.sh        # Testing script
├── docker-compose.production.yml # Production compose template
└── nginx-config-template/
    └── default.conf              # Nginx configuration template
```

### Template Variables
- `ECR_BACKEND_URI`: Backend container image URI
- `ECR_FRONTEND_URI`: Frontend container image URI
- `AWS_REGION`: AWS region for ECR authentication

## 🔄 Deployment Process

### 1. Template Upload
- Uploads `docker-compose.production.yml` to remote server
- Uploads nginx configuration from `nginx-config-template/`
- Creates environment file with ECR URIs

### 2. Container Management
- Authenticates with ECR registry
- Pulls latest container images
- Starts services with health checks

### 3. Validation
- Tests backend API endpoints
- Validates frontend accessibility
- Checks CORS functionality

## 🛠️ Configuration Details

### Docker Compose Template
```yaml
# docker-compose.production.yml
services:
  moni-be:
    image: ${ECR_BACKEND_URI}
    ports: ["30080:8080"]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/transactions/categories"]
      
  moni-fe:
    image: ${ECR_FRONTEND_URI}
    ports: ["30081:80"]
    depends_on:
      moni-be: { condition: service_healthy }
```

### Nginx Configuration
```nginx
# nginx-config-template/default.conf
server {
    listen 80;
    
    location /api/ {
        proxy_pass http://moni-be:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **ECR Authentication Failure**
   ```bash
   # Re-authenticate manually
   aws ecr get-login-password --region us-east-1 | \
   sudo docker login --username AWS --password-stdin <ECR_URI>
   ```

2. **CORS Errors**
   - Backend automatically allows requests from any EC2 IP
   - No manual CORS configuration needed

3. **Service Startup Issues**
   ```bash
   # Check service logs
   ./manage-app.sh <IP> logs
   
   # Check container status
   ./manage-app.sh <IP> status
   ```

4. **Network Connectivity**
   ```bash
   # Test backend directly
   curl http://<EC2_IP>:30080/api/v1/transactions/categories
   
   # Test frontend proxy
   curl http://<EC2_IP>:30081/api/v1/transactions/categories
   ```

## 🔄 Updates and Maintenance

### Deploy New Version
1. Build and push new images to ECR
2. Run update command:
   ```bash
   ./manage-app.sh <EC2_IP> update
   ```

### Backup Configuration
```bash
# Backup remote configuration
scp -i ./moni-dev-k3s-key.pem ec2-user@<IP>:~/moni-deployment/.env ./backup/
scp -i ./moni-dev-k3s-key.pem ec2-user@<IP>:~/moni-deployment/docker-compose.yml ./backup/
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/v1/transactions/categories`
- Frontend: Proxied API requests through nginx

### Log Management
```bash
# Real-time logs
./manage-app.sh <IP> logs

# Specific service logs
ssh -i ./moni-dev-k3s-key.pem ec2-user@<IP>
sudo docker-compose logs moni-be
sudo docker-compose logs moni-fe
```

## 🔒 Security Notes

- ECR authentication tokens expire after 12 hours
- Use `manage-app.sh <IP> update` to refresh authentication
- SSH key should be kept secure and not committed to repository
- Environment files contain sensitive ECR URIs - handle carefully

## 🚀 Advanced Usage

### Custom Configuration
1. Modify templates in `docker-compose.production.yml` or `nginx-config-template/`
2. Re-run deployment: `./deploy-simple.sh <IP>`

### Multiple Environments
1. Create environment-specific template files
2. Modify deployment script to accept environment parameter
3. Deploy to different EC2 instances with different configurations

---

This simplified approach maintains all automation benefits while using maintainable template files instead of inline configuration generation.