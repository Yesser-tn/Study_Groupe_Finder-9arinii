<?php
session_start();
include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to send a message.";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $receiver_id = $_POST['receiver_id'];  // ID of the user to send the message to
    $message = $_POST['message'];

    // Insert message into the database
    $sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$_SESSION['user_id'], $receiver_id, $message])) {
        echo "Message sent successfully.";
    } else {
        echo "Error sending the message.";
    }
}
?>

<form method="POST" action="send_message.php">
    <label>Receiver ID:</label><br>
    <input type="text" name="receiver_id" required><br>
    <label>Message:</label><br>
    <textarea name="message" required></textarea><br>
    <button type="submit">Send Message</button>
</form>
