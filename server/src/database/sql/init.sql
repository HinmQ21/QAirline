DROP DATABASE IF EXISTS qairline_db;
CREATE DATABASE qairline_db;
USE qairline_db;

-- Bảng admin 
DROP TABLE IF EXISTS admin;
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role ENUM('flight_manager', 'news_manager', 'super_admin') DEFAULT 'flight_manager'
);

-- Bảng airport
DROP TABLE IF EXISTS airport;
CREATE TABLE airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    country VARCHAR(50)
);

-- Bảng airplane
DROP TABLE IF EXISTS airplane;
CREATE TABLE airplane (
    airplane_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    manufacturer VARCHAR(50),
    model VARCHAR(50),
    total_seats INT NOT NULL
);

-- Bảng seat
DROP TABLE IF EXISTS seat;
CREATE TABLE seat (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    airplane_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    class ENUM('economy', 'business', 'first') DEFAULT 'economy',
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (airplane_id) REFERENCES airplane(airplane_id) ON DELETE CASCADE
);

-- Bảng flight 
DROP TABLE IF EXISTS flight;
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    airplane_id INT NOT NULL,
    departure_airport_id INT NOT NULL,
    arrival_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    status ENUM('scheduled', 'delayed', 'cancelled') DEFAULT 'scheduled',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by INT NULL,
    updated_at DATETIME DEFAULT NULL,
    FOREIGN KEY (airplane_id) REFERENCES airplane(airplane_id) ON DELETE RESTRICT,
    FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id) ON DELETE RESTRICT,
    FOREIGN KEY (arrival_airport_id) REFERENCES airport(airport_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id) ON DELETE SET NULL
);

-- Bảng customer
DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

-- Bảng booking
DROP TABLE IF EXISTS booking;
CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    flight_id INT NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('booked', 'cancelled') DEFAULT 'booked',
    total_price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE RESTRICT
);

-- Bảng ticket
DROP TABLE IF EXISTS ticket;
CREATE TABLE ticket (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_dob DATE,
    price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(seat_id) ON DELETE RESTRICT,
    UNIQUE (seat_id, booking_id)
);

-- Bảng news
DROP TABLE IF EXISTS news;
CREATE TABLE news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('introduction', 'promotion', 'announcement', 'news') DEFAULT 'news',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id) ON DELETE RESTRICT
);

-- Bảng notification
DROP TABLE IF EXISTS notification;
CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    flight_id INT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('delay', 'cancellation', 'general') DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE SET NULL
);

-- Tạo chỉ mục (index) để tối ưu tìm kiếm
-- CREATE INDEX idx_flight_departure ON flight(departure_time);
-- CREATE INDEX idx_booking_customer ON booking(customer_id);
-- CREATE INDEX idx_notification_customer ON notification(customer_id);