<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$room_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Check if room exists and belongs to the user
$stmt = $conn->prepare("SELECT * FROM study_rooms WHERE id = ? AND created_by = ?");
$stmt->bind_param("ii", $room_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $_SESSION['error'] = "Room not found or you don't have permission to delete it";
    header("Location: dashboard.php");
    exit;
}

// Delete room participants first (due to foreign key constraint)
$stmt = $conn->prepare("DELETE FROM room_participants WHERE room_id = ?");
$stmt->bind_param("i", $room_id);
$stmt->execute();

// Delete the room
$stmt = $conn->prepare("DELETE FROM study_rooms WHERE id = ? AND created_by = ?");
$stmt->bind_param("ii", $room_id, $user_id);

if ($stmt->execute()) {
    $_SESSION['success'] = "Study room deleted successfully";
} else {
    $_SESSION['error'] = "Error deleting study room: " . $stmt->error;
}

header("Location: dashboard.php");
exit;
?>