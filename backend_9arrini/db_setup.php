<?php
// Database setup script
$host = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($host, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS 9arrini_db";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select the database
$conn->select_db("9arrini_db");

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT 'profile.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Users table created successfully<br>";
} else {
    echo "Error creating users table: " . $conn->error . "<br>";
}

// Create study_rooms table
$sql = "CREATE TABLE IF NOT EXISTS study_rooms (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT(11) NOT NULL,
    description TEXT,
    created_by INT(11),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Study rooms table created successfully<br>";
} else {
    echo "Error creating study rooms table: " . $conn->error . "<br>";
}

// Create room_participants table
$sql = "CREATE TABLE IF NOT EXISTS room_participants (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    room_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES study_rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_participant (room_id, user_id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Room participants table created successfully<br>";
} else {
    echo "Error creating room participants table: " . $conn->error . "<br>";
}

// Create password_reset table
$sql = "CREATE TABLE IF NOT EXISTS password_reset (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Password reset table created successfully<br>";
} else {
    echo "Error creating password reset table: " . $conn->error . "<br>";
}

echo "Database setup completed successfully!";
$conn->close();
?>