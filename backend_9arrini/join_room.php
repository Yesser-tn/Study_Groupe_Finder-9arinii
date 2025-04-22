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
    header("Location: browse_rooms.php");
    exit;
}

$room = $result->fetch_assoc();

// Check if user is already a participant
$stmt = $conn->prepare("SELECT * FROM room_participants WHERE room_id = ? AND user_id = ?");
$stmt->bind_param("ii", $room_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $_SESSION['error'] = "You are already a participant in this room";
    header("Location: dashboard.php");
    exit;
}

// Check if room is at capacity
$stmt = $conn->prepare("SELECT COUNT(*) as participant_count FROM room_participants WHERE room_id = ?");
$stmt->bind_param("i", $room_id);
$stmt->execute();
$result = $stmt->get_result();
$participant_count = $result->fetch_assoc()['participant_count'];

if ($participant_count >= $room['capacity']) {
    $_SESSION['error'] = "This study room is already at full capacity";
    header("Location: browse_rooms.php");
    exit;
}

// Add user to room participants
$stmt = $conn->prepare("INSERT INTO room_participants (room_id, user_id) VALUES (?, ?)");
$stmt->bind_param("ii", $room_id, $user_id);

if ($stmt->execute()) {
    $_SESSION['success'] = "You have successfully joined the study room";
    header("Location: dashboard.php");
} else {
    $_SESSION['error'] = "Error joining study room: " . $stmt->error;
    header("Location: browse_rooms.php");
}
exit;
?>