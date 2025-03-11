CREATE TABLE invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inviter_id INT,  -- ID of the user sending the invitation
    invitee_email VARCHAR(255),  -- Email of the person invited
    token VARCHAR(255),  -- Unique token for the invitation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Time of creation
    status ENUM('pending', 'accepted', 'expired') DEFAULT 'pending',  -- Status of the invitation
    FOREIGN KEY (inviter_id) REFERENCES users(id)
);
