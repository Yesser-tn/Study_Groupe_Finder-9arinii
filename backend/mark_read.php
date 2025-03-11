<?php
session_start();
include('config.php');

if (isset($_POST['message_id'])) {
    $message_id = $_POST['message_id'];

    // Mark message as read
    $sql = "UPDATE messages SET is_read = 1 WHERE id = ? AND receiver_id = ?";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$message_id, $_SESSION['user_id']])) {
        echo "Message marked as read.";
        header("Location: view_messages.php");
        exit;
    } else {
        echo "Error marking the message as read.";
    }
}
?>
