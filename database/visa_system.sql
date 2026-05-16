-- KSA Digital Visa System Database
-- Run: mysql -u root -p < visa_system.sql

CREATE DATABASE IF NOT EXISTS visa_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE visa_system;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT 'Administrator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Visa applicants table
CREATE TABLE IF NOT EXISTS visa_applicants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  visa_number VARCHAR(50) NOT NULL UNIQUE,
  visa_type VARCHAR(100) NOT NULL DEFAULT 'Tourist',
  sponsor_name VARCHAR(255) DEFAULT NULL,
  place_of_issue VARCHAR(255) DEFAULT 'Saudi Digital Embassy - السفارة السعودية الرقمية',
  border_no VARCHAR(50) DEFAULT NULL,
  local_service VARCHAR(50) DEFAULT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  profile_photo VARCHAR(500) DEFAULT NULL,
  barcode_qr VARCHAR(500) DEFAULT NULL,
  application_number VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_passport (passport_number),
  INDEX idx_visa_number (visa_number),
  INDEX idx_status (status),
  INDEX idx_application (application_number)
);

-- Visa activity logs
CREATE TABLE IF NOT EXISTS visa_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visa_id INT DEFAULT NULL,
  admin_id INT DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visa_id) REFERENCES visa_applicants(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Default admin (password: admin123) - bcrypt hash
INSERT INTO admins (email, password, full_name) VALUES
('admin@ksa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator');

-- Dummy visa applicants
INSERT INTO visa_applicants (
  full_name, passport_number, nationality, visa_number, visa_type,
  sponsor_name, issue_date, expiry_date, status, application_number, barcode_qr
) VALUES
(
  'Ahmed Mohammed Al-Rashid',
  'P12345678',
  'United Arab Emirates',
  'SA-2025-001234',
  'Tourist',
  'Ministry of Tourism KSA',
  '2025-01-15',
  '2025-04-15',
  'approved',
  'APP-2025-000001',
  NULL
),
(
  'Fatima Hassan Al-Zahra',
  'P87654321',
  'Egypt',
  'SA-2025-001235',
  'Business',
  'Saudi Business Council',
  '2025-02-01',
  '2025-05-01',
  'approved',
  'APP-2025-000002',
  NULL
),
(
  'Omar Khalid Al-Saud',
  'P11223344',
  'Pakistan',
  'SA-2025-001236',
  'Work',
  'Saudi Aramco',
  '2025-03-01',
  '2025-06-01',
  'pending',
  'APP-2025-000003',
  NULL
),
(
  'Sarah Ibrahim Al-Nasser',
  'P55667788',
  'Jordan',
  'SA-2025-001237',
  'Family Visit',
  'Al-Nasser Family',
  '2025-01-20',
  '2025-02-20',
  'rejected',
  'APP-2025-000004',
  NULL
),
(
  'Yusuf Ali Al-Mahdi',
  'P99887766',
  'Indonesia',
  'SA-2025-001238',
  'Umrah',
  'Ministry of Hajj',
  '2025-04-01',
  '2025-05-01',
  'approved',
  'APP-2025-000005',
  NULL
);
