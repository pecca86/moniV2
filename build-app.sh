#!/bin/bash

set -e

# 1. Build images with docker compose
echo "Building images with docker compose..."
docker compose -f docker-compose-moni.yaml build

# 2. Load images into kind
echo "Loading images into kind..."
kind load docker-image moni-be-slim:latest --name kind
kind load docker-image moni-fe:latest --name kind

# 3. Ensure /data/moni-db exists in kind node
echo "Ensuring /data/moni-db exists in kind node..."
docker exec kind-control-plane mkdir -p /data/moni-db

# 4. Apply Kubernetes YAML
echo "Applying Moni.yaml..."
kubectl apply -f Moni.yaml

# 5. Port-forward backend
echo "Port-forwarding moni-be (backend) to localhost:8080..."
kubectl port-forward service/moni-be 8080:8080 -n moni &
BE_PID=$!

# 6. (Optional) Port-forward frontend
echo "Port-forwarding moni-fe (frontend) to localhost:8081..."
kubectl port-forward service/moni-fe 8081:80 -n moni &
FE_PID=$!

echo "All done!"
echo "Frontend: http://localhost:8081"
echo "Backend:  http://localhost:8080"
echo "Press Ctrl+C to stop port-forwarding."

wait $BE_PID $FE_PID