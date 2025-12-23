#!/bin/bash

# Script to create Admin account
# Run this script after backend has started at http://localhost:8080

echo "🚀 Creating Admin account..."
echo ""

# Try to create directly with ADMIN role
echo "📝 Trying to create user with ADMIN role..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Admin User",
    "username": "admin01",
    "password": "Admin@123",
    "email": "admin01@example.com",
    "phone": "0999999999",
    "address": "Admin Headquarters",
    "role": "ADMIN",
    "enabled": true
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Code: $HTTP_CODE"
echo "Response: $BODY"

if [ "$HTTP_CODE" == "201" ] || [ "$HTTP_CODE" == "200" ]; then
    echo ""
    echo "✅ Admin account created successfully!"
    echo ""
    echo "📋 Login information:"
    echo "   👤 Username: admin01"
    echo "   🔑 Password: Admin@123"
    echo ""
    echo "🌐 You can now log in at: http://localhost:3000/login"
    exit 0
fi

# If not, try method 2: Create CUSTOMER then update
if [ "$HTTP_CODE" == "409" ]; then
    echo ""
    echo "⚠️  User already exists. Updating role to ADMIN..."
    
    # Get user list to find ID
    USERS_RESPONSE=$(curl -s http://localhost:8080/api/users)
    
    if command -v jq &> /dev/null; then
        USER_ID=$(echo $USERS_RESPONSE | jq -r '.[] | select(.username == "admin01") | .id')
    else
        echo "⚠️  Need jq to parse JSON. Please install jq or update manually via API."
        echo "Or you can find ID in database and run:"
        echo "curl -X PUT http://localhost:8080/api/users/<ID> -H 'Content-Type: application/json' -d '{\"role\":\"ADMIN\",\"enabled\":true}'"
        exit 1
    fi
    
    if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
        echo "❌ User admin01 not found"
        exit 1
    fi
    
    echo "Found user with ID: $USER_ID"
    UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT http://localhost:8080/api/users/$USER_ID \
      -H "Content-Type: application/json" \
      -d '{
        "fullname": "Admin User",
        "username": "admin01",
        "email": "admin01@example.com",
        "phone": "0999999999",
        "address": "Admin Headquarters",
        "role": "ADMIN",
        "enabled": true
      }')
    
    UPDATE_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
    if [ "$UPDATE_CODE" == "200" ]; then
        echo "✅ Role updated to ADMIN!"
        echo ""
        echo "📋 Login information:"
        echo "   👤 Username: admin01"
        echo "   🔑 Password: Admin@123"
        echo ""
        echo "🌐 You can now log in at: http://localhost:3000/login"
    else
        echo "❌ Could not update role. Response: $UPDATE_RESPONSE"
        exit 1
    fi
else
    echo "❌ Error creating user. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
fi

