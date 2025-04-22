<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$room_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Check if room exists
$stmt = $conn->prepare("SELECT * FROM study_rooms WHERE id = ?");
$stmt->bind_param("i", $room_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $_SESSION['error'] = "Study room not found";
    header("Location: dashboard.php");
    exit;
}

$room = $result->fetch_assoc();

// Check if user is a participant and not the creator
if ($room['created_by'] == $user_id) {
    $_SESSION['error'] = "You cannot leave a room you created. You can delete it instead.";
    header("Location: dashboard.php");
    exit;
}

// Remove user from room participants
$stmt = $conn->prepare("DELETE FROM room_participants WHERE room_id = ? AND user_id = ?");
$stmt->bind_param("ii", $room_id, $user_id);

if ($stmt->execute()) {
    $_SESSION['success'] = "You have successfully left the study room";
} else {
    $_SESSION['error'] = "Error leaving study room: " . $stmt->error;
}

header("Location: dashboard.php");
exit;
?>