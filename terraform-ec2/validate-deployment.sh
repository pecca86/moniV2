#!/bin/bash

# Moni Application Validation Script
# Tests all functionality after deployment

echo "🧪 Testing Moni Application Deployment"
echo "====================================="

if [ -z "$1" ]; then
    echo "Usage: $0 <EC2_IP_ADDRESS>"
    echo "Example: $0 3.72.52.245"
    exit 1
fi

IP=$1

echo "Testing application at IP: $IP"

# Test frontend
echo -n "✅ Frontend (Static Content): "
if curl -s -f "http://$IP:30081" | grep -q "M O N I"; then
    echo "PASS"
else
    echo "FAIL"
fi

# Test backend API
echo -n "✅ Backend (Categories API): "
CATEGORIES=$(curl -s "http://$IP:30080/api/v1/transactions/categories" | jq length 2>/dev/null)
if [ "$CATEGORIES" = "18" ]; then
    echo "PASS ($CATEGORIES categories)"
else
    echo "FAIL (Expected 18, got $CATEGORIES)"
fi

# Test frontend proxy
echo -n "✅ Frontend Proxy (API through nginx): "
PROXY_CATEGORIES=$(curl -s "http://$IP:30081/api/v1/transactions/categories" | jq length 2>/dev/null)
if [ "$PROXY_CATEGORIES" = "18" ]; then
    echo "PASS ($PROXY_CATEGORIES categories)"
else
    echo "FAIL (Expected 18, got $PROXY_CATEGORIES)"
fi

# Test CORS with register endpoint
echo -n "✅ CORS (Register endpoint): "
REGISTER_RESPONSE=$(curl -s -w "%{http_code}" -X POST "http://$IP:30080/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -H "Origin: http://$IP:30081" \
    -d '{"email":"test'$(date +%s)'@example.com","password":"testpass123","firstName":"Test","lastName":"User"}' \
    -o /dev/null)

if [ "$REGISTER_RESPONSE" = "200" ]; then
    echo "PASS (Registration successful)"
else
    echo "FAIL (HTTP $REGISTER_RESPONSE)"
fi

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://$IP:30081"
echo "   Backend:  http://$IP:30080"
echo "   Register: http://$IP:30081/register"
echo ""
echo "🎯 Test complete!"