-- Script tạo Admin trực tiếp trong MySQL
-- Password: Admin@123
-- Hash BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

USE ecommerce_db;

-- Xóa user cũ nếu tồn tại (nếu muốn tạo mới)
-- DELETE FROM users WHERE username = 'admin01';

-- Tạo user admin mới
INSERT INTO users (id, fullname, username, password, email, address, phone, enabled, role, created_at, updated_at)
VALUES (
    UUID_TO_BIN(UUID()),
    'Admin User',
    'admin01',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin01@example.com',
    'Admin Headquarters',
    '0999999999',
    1,
    'ADMIN',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    role = 'ADMIN',
    enabled = 1,
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    updated_at = NOW();

-- Kiểm tra kết quả
SELECT 
    BIN_TO_UUID(id) as id,
    username,
    fullname,
    email,
    role,
    enabled,
    created_at
FROM users 
WHERE username = 'admin01';


