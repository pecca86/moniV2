#!/bin/bash
# User data script for K3s installation on Amazon Linux 2023

set -e

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=========================================="
echo "Starting K3s installation..."
echo "K3s Version: ${k3s_version}"
echo "Project: ${project_name}-${environment}"
echo "=========================================="

# Update system
dnf update -y

# Ensure SSM agent is running after package updates
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent || true

# Install required packages (fail2ban is optional - not in all AL2023 repos)
dnf install -y --allowerasing curl wget git jq nc
dnf install -y fail2ban || echo "WARNING: fail2ban not available, skipping"

# Cap journal size to prevent disk fill
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/size.conf << 'EOF'
[Journal]
SystemMaxUse=200M
EOF
systemctl restart systemd-journald

# Block SSH brute force (only if fail2ban was installed)
if systemctl list-unit-files fail2ban.service &>/dev/null; then
  systemctl enable --now fail2ban
fi

# Install K3s with native containerd
echo "Installing K3s..."
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${k3s_version}" sh -s - \
    --write-kubeconfig-mode 644 \
    --node-name "${project_name}-${environment}"

# Wait for K3s to be ready
echo "Waiting for K3s..."
sleep 30
timeout=120
elapsed=0
while ! kubectl get nodes >/dev/null 2>&1 && [ $elapsed -lt $timeout ]; do
    sleep 5
    elapsed=$((elapsed + 5))
done

if ! kubectl get nodes >/dev/null 2>&1; then
    echo "K3s failed to start"
    systemctl status k3s --no-pager
    exit 1
fi

echo "K3s is ready!"
kubectl get nodes

# Create moni namespace
kubectl create namespace moni || true

# Set up kubectl for ec2-user
mkdir -p /home/ec2-user/.kube
cp /etc/rancher/k3s/k3s.yaml /home/ec2-user/.kube/config
chown -R ec2-user:ec2-user /home/ec2-user/.kube

# Create ECR pull secret using instance IAM role
echo "Creating ECR pull secret..."
ECR_TOKEN=$(aws ecr get-login-password --region ${aws_region})
kubectl create secret docker-registry ecr-pull-secret \
    --docker-server="${ecr_registry}" \
    --docker-username=AWS \
    --docker-password="$ECR_TOKEN" \
    -n moni

# Refresh ECR pull secret every 6 hours (tokens expire after 12h)
cat > /usr/local/bin/refresh-ecr-secret.sh << 'SCRIPT'
#!/bin/bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
ECR_TOKEN=$(aws ecr get-login-password --region ${aws_region})
kubectl create secret docker-registry ecr-pull-secret \
    --docker-server="${ecr_registry}" \
    --docker-username=AWS \
    --docker-password="$ECR_TOKEN" \
    -n moni \
    --dry-run=client -o yaml | kubectl apply -f -
SCRIPT
chmod +x /usr/local/bin/refresh-ecr-secret.sh
echo "0 */6 * * * root /usr/local/bin/refresh-ecr-secret.sh" > /etc/cron.d/ecr-secret-refresh

chown -R ec2-user:ec2-user /home/ec2-user/

echo "K3s setup complete!"
kubectl get nodes
