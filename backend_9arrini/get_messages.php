<?php
require_once 'config.php';

$conn = getConnection();

$sql = "SELECT id, message, timestamp FROM messages ORDER BY timestamp ASC LIMIT 50";
$result = $conn->query($sql);

$messages = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($messages);

$conn->close();
?>