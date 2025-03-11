CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    subjects TEXT,  -- A comma-separated list of subjects (e.g., "Math, Science")
    availability TEXT,  -- A comma-separated list of available days/times (e.g., "Monday, 3 PM")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
