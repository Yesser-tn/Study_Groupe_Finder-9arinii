<?php
session_start();
include('config.php');

// logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please log in to view your study sessions.";
    exit;
}

// Get the study sessions for the logged-in user
$sql = "SELECT * FROM study_sessions WHERE user1_id = ? OR user2_id = ? ORDER BY session_date DESC LIMIT 5";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['user_id'], $_SESSION['user_id']]);
$sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($sessions) {
    echo "<h2>Your Study Sessions:</h2>";
    foreach ($sessions as $session) {
        echo "<div>";
        echo "<strong>Subject:</strong> " . htmlspecialchars($session['subject']) . "<br>";
        echo "<strong>Date:</strong> " . htmlspecialchars($session['session_date']) . "<br>";
        echo "<strong>Status:</strong> " . htmlspecialchars($session['status']) . "<br>";

        if ($session['status'] === 'upcoming') {
            echo "<form method='POST' action='cancel_session.php'>
                    <input type='hidden' name='session_id' value='" . $session['id'] . "'>
                    <button type='submit'>Cancel</button>
                  </form>";
        } elseif ($session['status'] === 'completed') {
            echo "<a href='evaluate_session.php?session_id=" . $session['id'] . "'>Evaluate Partner</a>";
        }
        
        echo "</div><br>";
    }
} else {
    echo "You have no study sessions scheduled.";
}
?>
