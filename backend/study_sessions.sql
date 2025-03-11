CREATE TABLE study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT,  -- First participant
    user2_id INT,  -- Second participant
    subject VARCHAR(255),
    session_date DATETIME,  -- Scheduled date and time
    status ENUM('upcoming', 'completed', 'canceled') DEFAULT 'upcoming',  -- Status tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);
