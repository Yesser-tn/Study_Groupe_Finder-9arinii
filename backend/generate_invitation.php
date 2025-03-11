<?php
session_start();
include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to send an invitation.";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];

    // Generate unique token
    $token = bin2hex(random_bytes(16));

    // Insert invitation into the database
    $sql = "INSERT INTO invitations (inviter_id, invitee_email, token) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$_SESSION['user_id'], $email, $token])) {
        echo "Invitation sent successfully. Please check your email.";
        
        // Send email with invitation link
        $invite_link = "http://yourwebsite.com/accept_invitation.php?token=$token";
        mail($email, "Invitation to join 9arrini", "Click on the link to accept the invitation: $invite_link");
    } else {
        echo "Error sending the invitation.";
    }
}
?>

<form method="POST" action="generate_invitation.php">
    <label>Invitee Email:</label><br>
    <input type="email" name="email" required><br>
    <button type="submit">Send Invitation</button>
</form>
