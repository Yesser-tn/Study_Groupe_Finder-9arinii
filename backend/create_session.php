<?php
session_start();
include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to create a study session.";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $partner_id = filter_input(INPUT_POST, 'partner_id', FILTER_VALIDATE_INT);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $date = filter_input(INPUT_POST, 'session_date', FILTER_SANITIZE_STRING);
    
    if (!$partner_id || empty($subject) || empty($date)) {
        echo "Invalid input data.";
    }
    
    $stmt = $pdo->prepare("INSERT INTO study_sessions (user1_id, user2_id, subject, session_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $partner_id, $subject, $date]);

    echo "Session created!";
}
?>

<form method="POST" action="create_session.php">
    <label>Partner ID:</label><br>
    <input type="text" name="partner_id" required><br>
    <label>Subject:</label><br>
    <input type="text" name="subject" required><br>
    <label>Date and Time:</label><br>
    <input type="datetime-local" name="session_date" required><br>
    <button type="submit">Create Session</button>
</form>
