<?php
session_start();
include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to evaluate your partner.";
    exit;
}

if (isset($_GET['session_id'])) {
    $session_id = $_GET['session_id'];

    // Get session details
    $sql = "SELECT * FROM study_sessions WHERE id = ? AND status = 'completed'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$session_id]);
    $session = $stmt->fetch();

    if (!$session) {
        echo "Invalid session.";
        exit;
    }

    // Identify the partner
    $partner_id = ($session['user1_id'] == $_SESSION['user_id']) ? $session['user2_id'] : $session['user1_id'];

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $rating = $_POST['rating'];
        $feedback = $_POST['feedback'];

        // Insert review into database
        $sql = "INSERT INTO session_reviews (session_id, reviewer_id, reviewed_id, rating, feedback) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$session_id, $_SESSION['user_id'], $partner_id, $rating, $feedback])) {
            echo "Evaluation submitted successfully.";
        } else {
            echo "Error submitting evaluation.";
        }
    }
}
?>

<form method="POST" action="evaluate_session.php?session_id=<?= $session_id ?>">
    <label>Rating (1-5):</label><br>
    <input type="number" name="rating" min="1" max="5" required><br>
    <label>Feedback:</label><br>
    <textarea name="feedback" required></textarea><br>
    <button type="submit">Submit Evaluation</button>
</form>
