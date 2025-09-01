-- Create databases for each service
CREATE DATABASE IF NOT EXISTS dms_auth;
CREATE DATABASE IF NOT EXISTS dms_metadata;
CREATE DATABASE IF NOT EXISTS dms_files;

-- Use auth database and create admin user
USE dms_auth;

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (username, password, email, role, created_at) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@dms.com', 'ADMIN', NOW()),
('user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'user@dms.com', 'USER', NOW());

-- Note: The password hash above is for 'secret' - you should change this in production

