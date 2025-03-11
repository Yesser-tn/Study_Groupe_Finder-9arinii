<?php
session_start();
include('config.php');

// Get the selected filter values from the form
$subjects_filter = $_GET['subjects'] ?? '';
$availability_filter = $_GET['availability'] ?? '';

// Build the SQL query based on the filters
$sql = "SELECT * FROM users WHERE 1=1";

$params = [];
if ($subjects_filter) {
    $sql .= " AND subjects LIKE ?";
    $params[] = "%$subjects_filter%";
}

if ($availability_filter) {
    $sql .= " AND availability LIKE ?";
    $params[] = "%$availability_filter%";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Display the search results
if ($results) {
    echo "<h2>Search Results:</h2>";
    foreach ($results as $user) {
        echo "<div>";
        echo "<strong>Name:</strong> " . htmlspecialchars($user['name']) . "<br>";
        echo "<strong>Email:</strong> " . htmlspecialchars($user['email']) . "<br>";
        echo "<strong>Subjects:</strong> " . htmlspecialchars($user['subjects']) . "<br>";
        echo "<strong>Availability:</strong> " . htmlspecialchars($user['availability']) . "<br>";
        echo "</div><br>";
    }
} else {
    echo "No users found with the selected filters.";
}

// Recommendations based on shared interests
echo "<h3>Recommendations based on shared interests:</h3>";

$recommendation_sql = "SELECT * FROM users WHERE subjects LIKE ? OR availability LIKE ?";
$recommendation_stmt = $pdo->prepare($recommendation_sql);
$recommendation_stmt->execute(["%$subjects_filter%", "%$availability_filter%"]);
$recommended_users = $recommendation_stmt->fetchAll(PDO::FETCH_ASSOC);

if ($recommended_users) {
    echo "<h4>Suggested Users:</h4>";
    foreach ($recommended_users as $recommended_user) {
        // Avoid recommending the current user (if searching)
        if ($recommended_user['id'] != $_SESSION['user_id']) {
            echo "<div>";
            echo "<strong>Name:</strong> " . htmlspecialchars($recommended_user['name']) . "<br>";
            echo "<strong>Email:</strong> " . htmlspecialchars($recommended_user['email']) . "<br>";
            echo "<strong>Shared Subjects:</strong> " . htmlspecialchars($recommended_user['subjects']) . "<br>";
            echo "<strong>Shared Availability:</strong> " . htmlspecialchars($recommended_user['availability']) . "<br>";
            echo "</div><br>";
        }
    }
} else {
    echo "No recommendations based on shared interests.";
}
?>