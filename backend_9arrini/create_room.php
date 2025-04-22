<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $capacity = (int)$_POST['capacity'];
    $description = trim($_POST['description']);
     $topic = trim($_POST['topic']); 
    $created_by = $_SESSION['user_id'];
    $created_at = date('Y-m-d H:i:s'); // Added timestamp
    
    // Validate input
    if (empty($name) || empty($description) || empty($topic) || $capacity <= 0) {
        $_SESSION['error'] = "All fields are required and capacity must be greater than 0";
        header("Location: dashboard.php");
        exit;
    }
    
    // Insert new study room
    $stmt = $conn->prepare("INSERT INTO study_rooms (name, capacity, description, topic, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissss", $name, $capacity, $description, $topic, $created_by, $created_at);
    
    if ($stmt->execute()) {
        // Get the new room ID
        $room_id = $stmt->insert_id;
        
        // Add creator as a participant
        $stmt = $conn->prepare("INSERT INTO room_participants (room_id, user_id, joined_at) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $room_id, $created_by, $created_at);
        $stmt->execute();
        
        $_SESSION['success'] = "Study room created successfully";
    } else {
        $_SESSION['error'] = "Error creating study room: " . $stmt->error;
    }
    
    header("Location: dashboard.php");
    exit;
}

// Get user information for the create room form
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Study Room - 9arrini</title>
    <link rel="icon" href="logo.png">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .profile-pic {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .username {
            font-weight: bold;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        input[type="text"],
        input[type="number"],
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        textarea {
            height: 100px;
            resize: vertical;
        }

        .button {
            background-color: #34bfa3;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 40px;
            cursor: pointer;
            font-size: 16px;
        }

        .button:hover {
            background-color: #2a9c82;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: black;
        }
    </style>
</head>
<body>
    <div class="container">
        <span class="close" onclick="window.location.href='dashboard.php'">&times;</span>
        
        <div class="header">
            <img src="<?php echo htmlspecialchars($user['profile_pic']); ?>" alt="Profile Picture" class="profile-pic">
            <span class="username">@<?php echo htmlspecialchars($user['username']); ?></span>
        </div>

        <form action="create_room.php" method="POST">
            <div class="form-group">
                <label for="roomName">Room Name:</label>
                <input type="text" id="roomName" name="name" required>
            </div>

            <div class="form-group">
                <label for="roomTopic">Room Topic:</label>
                <input type="text" id="roomTopic" name="topic" required>
            </div>

            <div class="form-group">
                <label for="roomCapacity">Room Capacity:</label>
                <input type="number" id="roomCapacity" name="capacity" min="1" required>
            </div>

            <div class="form-group">
                <label for="roomDescription">Room Description:</label>
                <textarea id="roomDescription" name="description" required></textarea>
            </div>

            <button type="submit" class="button">Create Room</button>
        </form>
    </div>
</body>
</html>