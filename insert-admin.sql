-- Script to create Admin account directly in database
-- Run this script in MySQL: mysql -u root -p ecommerce_db < insert-admin.sql
-- Or copy and paste into MySQL client

-- Create admin user with password: Admin@123
-- Password hashed with BCrypt: $2a$10$...

INSERT INTO users (id, fullname, username, password, email, address, phone, enabled, role, created_at, updated_at)
VALUES (
    UUID_TO_BIN(UUID()),
    'Admin User',
    'admin01',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Password: Admin@123
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
    updated_at = NOW();

-- Check if user was created
SELECT 
    BIN_TO_UUID(id) as id,
    username,
    fullname,
    email,
    role,
    enabled
FROM users 
WHERE username = 'admin01';


