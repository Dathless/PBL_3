-- Reset password for existing ADMIN user (johnydoe1)
-- Password mới: Admin@123
-- Hash BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

USE ecommerce_db;

-- Reset password for user johnydoe1
UPDATE users 
SET 
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    enabled = 1,
    role = 'ADMIN',
    updated_at = NOW()
WHERE username = 'johnydoe1';

-- Kiểm tra kết quả
SELECT 
    username,
    fullname,
    email,
    role,
    enabled
FROM users 
WHERE username = 'johnydoe1';


