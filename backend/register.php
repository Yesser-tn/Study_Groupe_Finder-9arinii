<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Validate fields
    if (filter_var($email, FILTER_VALIDATE_EMAIL) && strlen($password) >= 6) {
        // Insert data into the database
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$name, $email, $password_hash])) {
            echo "User registered successfully.";
        } else {
            echo "Error during registration.";
        }
    } else {
        echo "Please enter a valid email and a strong password.";
    }
}
?>

<form method="POST" action="register.php">
    <label>Name:</label><br>
    <input type="text" name="name"><br>
    <label>Email:</label><br>
    <input type="email" name="email"><br>
    <label>Password:</label><br>
    <input type="password" name="password"><br>
    <button type="submit">Register</button>
</form>
