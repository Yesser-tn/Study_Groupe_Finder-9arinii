<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];

// Get all rooms that the user hasn't created or joined
$stmt = $conn->prepare("
    SELECT sr.* 
    FROM study_rooms sr
    WHERE sr.created_by != ? 
    AND NOT EXISTS (
        SELECT 1 
        FROM room_participants rp 
        WHERE rp.room_id = sr.id AND rp.user_id = ?
    )
");
$stmt->bind_param("ii", $user_id, $user_id);
$stmt->execute();
$available_rooms = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Study Rooms - 9arrini</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="logo.png">
    <style>
        :root {
            --primary-color: #00BFA5;
            --secondary-color: #4A90E2;
            --background-color: #F5F7FA;
            --text-color: #2C3E50;
            --card-bg: #FFFFFF;
            --border-color: #E0E0E0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .navbar {
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
        }

        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .logo img {
            height: 40px;
            margin-right: 10px;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        .main-content {
            margin-top: 80px;
            padding: 2rem 0;
        }

        .page-header {
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .page-header h1 {
            font-size: 2rem;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s ease, transform 0.3s ease;
            display: inline-block;
            text-decoration: none;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: #009688;
            transform: translateY(-2px);
        }

        .rooms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .room-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .room-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .room-card h3 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .room-card p {
            color: #666;
            margin-bottom: 1rem;
        }

        .room-card .capacity {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            color: #666;
        }

        .room-card .capacity svg {
            margin-right: 0.5rem;
        }

        .room-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        }

        .room-actions a {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .btn-join {
            background-color: var(--primary-color);
            color: white;
        }

        .empty-state {
            text-align: center;
            padding: 2rem;
            background: var(--card-bg);
            border-radius: 12px;
            border: 1px dashed var(--border-color);
        }

        .empty-state p {
            margin-bottom: 1rem;
            color: #666;
        }

        .error-message {
            background-color: #ffebee;
            color: #c62828;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .success-message {
            background-color: #e8f5e9;
            color: #2e7d32;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-content">
            <a href="dashboard.php" class="logo">
                <img src="logo.png" alt="9arrini Logo">
                9arrini-قَرِّيني
            </a>
            <div class="nav-links">
                <a href="dashboard.php">Dashboard</a>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1>Browse Study Rooms</h1>
                <a href="dashboard.php" class="btn btn-primary">Back to Dashboard</a>
            </div>
            
            <?php if (isset($_SESSION['error'])): ?>
                <div class="error-message">
                    <?php 
                        echo $_SESSION['error']; 
                        unset($_SESSION['error']);
                    ?>
                </div>
            <?php endif; ?>
            
            <?php if (isset($_SESSION['success'])): ?>
                <div class="success-message">
                    <?php 
                        echo $_SESSION['success']; 
                        unset($_SESSION['success']);
                    ?>
                </div>
            <?php endif; ?>

            <?php if ($available_rooms->num_rows > 0): ?>
                <div class="rooms-grid">
                    <?php while ($room = $available_rooms->fetch_assoc()): ?>
                        <div class="room-card">
                            <h3><?php echo htmlspecialchars($room['name']); ?></h3>
                            <div class="capacity">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                                </svg>
                                Capacity: <?php echo htmlspecialchars($room['capacity']); ?>
                            </div>
                            <p><?php echo htmlspecialchars($room['description']); ?></p>
                            <div class="room-actions">
                                <a href="join_room.php?id=<?php echo $room['id']; ?>" class="btn-join">Join Room</a>
                            </div>
                        </div>
                    <?php endwhile; ?>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <p>No available study rooms found.</p>
                    <p>Check back later or create your own room!</p>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>