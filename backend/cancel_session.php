<?php
session_start();
include('config.php');

if (isset($_POST['session_id'])) {
    $session_id = $_POST['session_id'];

    // Update session status to canceled
    $sql = "UPDATE study_sessions SET status = 'canceled' WHERE id = ? AND (user1_id = ? OR user2_id = ?)";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$session_id, $_SESSION['user_id'], $_SESSION['user_id']])) {
        echo "Study session canceled.";
        header("Location: view_sessions.php");
        exit;
    } else {
        echo "Error canceling the session.";
    }
}
?>
