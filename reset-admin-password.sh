#!/bin/bash

# Script tự động reset password cho admin user
# Chạy script này sau khi backend đã khởi động

echo "🔄 Đang reset password cho admin user..."

# Đợi backend sẵn sàng (tối đa 30 giây)
echo "⏳ Đang đợi backend khởi động..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
        echo "✅ Backend đã sẵn sàng!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend chưa khởi động sau 30 giây"
        echo "💡 Vui lòng khởi động backend trước: cd be && ./mvnw spring-boot:run"
        exit 1
    fi
    sleep 1
done

# Reset password
echo "🔐 Đang reset password cho user: johnydoe1..."
RESPONSE=$(curl -s -X POST "http://localhost:8080/api/admin/reset-admin-password?username=johnydoe1&newPassword=Admin@123")

echo ""
echo "Response: $RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success.*true"; then
    echo "✅ Password reset successful!"
    echo ""
    echo "📋 Login information:"
    echo "   👤 Username: johnydoe1"
    echo "   🔑 Password: Admin@123"
    echo ""
    echo "🌐 You can now log in at: http://localhost:3000/login"
else
    echo "❌ Error occurred while resetting password"
    echo "Response: $RESPONSE"
fi


