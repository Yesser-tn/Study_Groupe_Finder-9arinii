CREATE TABLE session_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,  -- The study session being reviewed
    reviewer_id INT,  -- User giving the review
    reviewed_id INT,  -- User being reviewed
    rating INT CHECK (rating BETWEEN 1 AND 5),  -- Rating (1 to 5)
    feedback TEXT,  -- Optional feedback
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES study_sessions(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_id) REFERENCES users(id)
);
