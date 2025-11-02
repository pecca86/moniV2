#!/bin/bash

# Moni Application Management Script
# Provides common operations for deployed application

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <EC2_IP> <COMMAND>"
    echo ""
    echo "Commands:"
    echo "  status    - Show application status"
    echo "  logs      - Show application logs"
    echo "  restart   - Restart all services"
    echo "  stop      - Stop all services"
    echo "  start     - Start all services"
    echo "  update    - Pull latest images and restart"
    echo "  test      - Run validation tests"
    echo ""
    echo "Example: $0 3.72.52.245 status"
    exit 1
fi

IP=$1
COMMAND=$2

# Auto-detect SSH key file
SSH_KEY=$(find . -name "*-key.pem" -type f | head -1)
if [ -z "$SSH_KEY" ]; then
    echo "❌ No SSH key file found! Expected *-key.pem"
    echo "Run 'terraform apply' to generate the SSH key"
    exit 1
fi

case $COMMAND in
    status)
        echo "📊 Checking application status..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            echo '=== Container Status ==='
            sudo docker-compose ps
            echo ''
            echo '=== Health Checks ==='
            echo 'Backend categories: '$(curl -s http://localhost:30080/api/v1/transactions/categories | jq length 2>/dev/null || echo 'Not ready')
            echo 'Frontend proxy: '$(curl -s http://localhost:30081/api/v1/transactions/categories | jq length 2>/dev/null || echo 'Not ready')
        "
        ;;
    logs)
        echo "📋 Showing application logs..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            sudo docker-compose logs --tail=50
        "
        ;;
    restart)
        echo "🔄 Restarting application..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            sudo docker-compose restart
        "
        ;;
    stop)
        echo "⏹️  Stopping application..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            sudo docker-compose down
        "
        ;;
    start)
        echo "▶️  Starting application..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            sudo docker-compose up -d
        "
        ;;
    update)
        echo "🔄 Updating to latest images..."
        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ec2-user@$IP "
            cd ~/moni-deployment
            
            # Re-authenticate with ECR
            aws ecr get-login-password --region \$(grep AWS_REGION .env | cut -d'=' -f2) | sudo docker login --username AWS --password-stdin \$(grep ECR_BACKEND_URI .env | cut -d'=' -f2 | cut -d':' -f1)
            
            # Pull latest images
            sudo docker-compose pull
            
            # Restart with new images
            sudo docker-compose up -d
            
            echo 'Update complete!'
        "
        ;;
    test)
        echo "🧪 Running validation tests..."
        ./validate-deployment.sh $IP
        ;;
    *)
        echo "❌ Unknown command: $COMMAND"
        echo "Run '$0 <IP> help' for usage information"
        exit 1
        ;;
esac