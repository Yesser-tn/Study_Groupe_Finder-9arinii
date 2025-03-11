<?php
session_start();
include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to view your messages.";
    exit;
}

// Get messages for the logged-in user
$sql = "SELECT messages.*, users.name AS sender_name FROM messages 
        JOIN users ON messages.sender_id = users.id 
        WHERE messages.receiver_id = ? ORDER BY messages.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['user_id']]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($messages) {
    echo "<h2>Your Messages:</h2>";
    foreach ($messages as $message) {
        echo "<div>";
        echo "<strong>From:</strong> " . htmlspecialchars($message['sender_name']) . "<br>";
        echo "<strong>Message:</strong> " . htmlspecialchars($message['message']) . "<br>";
        echo "<strong>Sent on:</strong> " . htmlspecialchars($message['created_at']) . "<br>";
        
        // Mark as read
        if (!$message['is_read']) {
            echo "<form method='POST' action='mark_read.php'>
                    <input type='hidden' name='message_id' value='" . $message['id'] . "'>
                    <button type='submit'>Mark as Read</button>
                  </form><br>";
        }
        
        echo "</div><br>";
    }
} else {
    echo "You have no new messages.";
}
?>