<?php
require_once 'config.php';

$conn = getConnection();

$sql = "SELECT id, task, completed FROM todos ORDER BY id DESC";
$result = $conn->query($sql);

$todos = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($todos);

$conn->close();
?>