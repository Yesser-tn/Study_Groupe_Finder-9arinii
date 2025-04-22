<?php
require_once 'config.php';

$conn = getConnection();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["message"])) {
        $message = $conn->real_escape_string($_POST["message"]);
        $sql = "INSERT INTO messages (message) VALUES ('$message')";

        if ($conn->query($sql) === TRUE) {
            echo "New message created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>