<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$room_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Check if room exists and belongs to the user
$stmt = $conn->prepare("SELECT * FROM study_rooms WHERE id = ? AND created_by = ?");
$stmt->bind_param("ii", $room_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $_SESSION['error'] = "Room not found or you don't have permission to edit it";
    header("Location: dashboard.php");
    exit;
}

$room = $result->fetch_assoc();

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $capacity = (int)$_POST['capacity'];
    $description = trim($_POST['description']);
    
    // Validate input
    if (empty($name) || empty($description) || $capacity <= 0) {
        $_SESSION['error'] = "All fields are required and capacity must be greater than 0";
        header("Location: edit_room.php?id=" . $room_id);
        exit;
    }
    
    // Update room
    $stmt = $conn->prepare("UPDATE study_rooms SET name = ?, capacity = ?, description = ? WHERE id = ? AND created_by = ?");
    $stmt->bind_param("sisii", $name, $capacity, $description, $room_id, $user_id);
    
    if ($stmt->execute()) {
        $_SESSION['success'] = "Study room updated successfully";
        header("Location: dashboard.php");
        exit;
    } else {
        $_SESSION['error'] = "Error updating study room: " . $stmt->error;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Study Room - 9arrini</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="logo.png">
    <style>
        :root {
            --primary-color: #00BFA5;
            --secondary-color: #4A90E2;
            --background-color: #F5F7FA;
            --text-color: #2C3E50;
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
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .container {
            max-width: 800px;
            margin: 80px auto 0;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
            max-width: 1200px;
            margin: 0 auto;
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

        h1 {
            margin-bottom: 1.5rem;
            color: var(--text-color);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
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

        .btn-secondary {
            background-color: #f5f5f5;
            color: var(--text-color);
            margin-right: 1rem;
        }

        .btn-secondary:hover {
            background-color: #e0e0e0;
        }

        .button-group {
            display: flex;
            justify-content: flex-start;
            margin-top: 1rem;
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
        <div class="nav-content">
            <a href="dashboard.php" class="logo">
                <img src="logo.png" alt="9arrini Logo">
                9arrini-قَرِّيني
            </a>
        </div>
    </nav>

    <div class="container">
        <h1>Edit Study Room</h1>
        
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

        <form action="edit_room.php?id=<?php echo $room_id; ?>" method="POST">
            <div class="form-group">
                <label for="name">Room Name</label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($room['name']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="capacity">Room Capacity</label>
                <input type="number" id="capacity" name="capacity" value="<?php echo htmlspecialchars($room['capacity']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="description">Room Description</label>
                <textarea id="description" name="description" required><?php echo htmlspecialchars($room['description']); ?></textarea>
            </div>
            
            <div class="button-group">
                <a href="dashboard.php" class="btn btn-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary">Update Room</button>
            </div>
        </form>
    </div>
</body>
</html>