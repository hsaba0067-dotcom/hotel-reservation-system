-- =============================================
-- Sheba Hotel Database - MySQL Schema
-- Run this in MySQL Workbench
-- =============================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'admin') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  floor INT NOT NULL,
  capacity INT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(100) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INT DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Sample rooms data
INSERT INTO rooms (name, type, room_number, floor, capacity, price_per_night, description, is_available) VALUES
('Deluxe King Room', 'Deluxe', '101', 1, 2, 150.00, 'Spacious room with king bed and city view', TRUE),
('Standard Twin Room', 'Standard', '102', 1, 2, 90.00, 'Comfortable twin room with garden view', TRUE),
('Suite Room', 'Suite', '201', 2, 4, 300.00, 'Luxury suite with living area and panoramic view', TRUE),
('Economy Single', 'Economy', '103', 1, 1, 60.00, 'Cozy single room perfect for solo travelers', TRUE),
('Family Room', 'Family', '202', 2, 5, 250.00, 'Large family room with two bedrooms', TRUE);

-- Sample admin user (password: admin123)
INSERT INTO users (full_name, email, password, role) VALUES
('Admin Saba', 'admin@shebahotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

SELECT 'Database setup complete!' AS message;
