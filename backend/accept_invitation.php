<?php
session_start();
include('config.php');

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Check if the token is valid
    $sql = "SELECT * FROM invitations WHERE token = ? AND status = 'pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token]);
    $invitation = $stmt->fetch();

    if ($invitation) {
        // Mark the invitation as accepted
        $sql = "UPDATE invitations SET status = 'accepted' WHERE token = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$token]);

        // Redirect to registration or profile page
        echo "Invitation accepted. You can now register or set up your profile.";
        // Redirect to the registration page or login page
        // header("Location: register.php"); or profile page
    } else {
        echo "Invalid or expired invitation link.";
    }
} else {
    echo "No token provided.";
}
?>
