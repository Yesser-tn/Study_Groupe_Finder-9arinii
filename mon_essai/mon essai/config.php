<?php
$host = 'localhost';
$db = 'rooms';
$user = 'root'; // default XAMPP username
$pass = ''; // default XAMPP password (usually empty)

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>