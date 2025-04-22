<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Get user information
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Get study rooms created by the user
$stmt = $conn->prepare("SELECT * FROM study_rooms WHERE created_by = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$created_rooms = $stmt->get_result();

// Get study rooms joined by the user
$stmt = $conn->prepare("
    SELECT sr.* 
    FROM study_rooms sr
    JOIN room_participants rp ON sr.id = rp.room_id
    WHERE rp.user_id = ? AND sr.created_by != ?
");
$stmt->bind_param("ii", $user_id, $user_id);
$stmt->execute();
$joined_rooms = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - 9arrini</title>
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

        .user-profile {
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
        }

        .user-profile img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 0.5rem 0;
            min-width: 180px;
            display: none;
            z-index: 101;
        }

        .dropdown-menu.active {
            display: block;
        }

        .dropdown-menu a {
            display: block;
            padding: 0.75rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            transition: background-color 0.3s ease;
        }

        .dropdown-menu a:hover {
            background-color: #f5f5f5;
        }

        .main-content {
            margin-top: 80px;
            padding: 2rem 0;
        }

        .dashboard-header {
            margin-bottom: 2rem;
        }

        .dashboard-header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
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

        .rooms-section {
            margin-bottom: 3rem;
        }

        .rooms-section h2 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
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
            justify-content: space-between;
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

        .btn-edit {
            background-color: #f5f5f5;
            color: var(--text-color);
        }

        .btn-delete {
            background-color: #ff5252;
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

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
            padding-top: 60px;
        }

        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 2rem;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
            border-radius: 12px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover,
        .close:focus {
            color: black;
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
                <div class="user-profile" onclick="toggleDropdown()">
                    <img src="<?php echo htmlspecialchars($user['profile_pic']); ?>" alt="Profile">
                    <span><?php echo htmlspecialchars($user['full_name']); ?></span>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="edit_profile.php">Edit Profile</a>
                        <a href="logout.php">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="dashboard-header">
                <h1>Welcome, <?php echo htmlspecialchars($user['full_name']); ?>!</h1>
                <button class="btn btn-primary" onclick="openCreateRoomModal()">Create Study Room</button>
            </div>

            <section class="rooms-section">
                <h2>Your Study Rooms</h2>
                <?php if ($created_rooms->num_rows > 0): ?>
                    <div class="rooms-grid">
                        <?php while ($room = $created_rooms->fetch_assoc()): ?>
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
                                    <a href="room.php?id=<?php echo $room['id']; ?>" class="btn-enter">Enter Room</a>
                                    <a href="edit_room.php?id=<?php echo $room['id']; ?>" class="btn-edit">Edit</a>
                                    <a href="delete_room.php?id=<?php echo $room['id']; ?>" class="btn-delete" onclick="return confirm('Are you sure you want to delete this room?')">Delete</a>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <p>You haven't created any study rooms yet.</p>
                        <button class="btn btn-primary" onclick="openCreateRoomModal()">Create Your First Room</button>
                    </div>
                <?php endif; ?>
            </section>

            <section class="rooms-section">
                <h2>Joined Study Rooms</h2>
                <?php if ($joined_rooms->num_rows > 0): ?>
                    <div class="rooms-grid">
                        <?php while ($room = $joined_rooms->fetch_assoc()): ?>
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
                                    <a href="room.php?id=<?php echo $room['id']; ?>" class="btn-enter">Enter Room</a>
                                    <a href="leave_room.php?id=<?php echo $room['id']; ?>" class="btn-delete" onclick="return confirm('Are you sure you want to leave this room?')">Leave Room</a>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <p>You haven't joined any study rooms yet.</p>
                        <a href="browse_rooms.php" class="btn btn-primary">Browse Available Rooms</a>
                    </div>
                <?php endif; ?>
            </section>
        </div>
    </main>

    <!-- Create Room Modal -->
    
    <div id="createRoomModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCreateRoomModal()">&times;</span>
            <h2>Create a New Study Room</h2>
            <form action="create_room.php" method="POST">
                <div class="form-group">
                    <label for="roomName">Room Name</label>
                    <input type="text" id="roomName" name="name" placeholder="Enter room name" required>
                </div>
                <div class="form-group">
                    <label for="roomTopic">Room Topic</label>
                    <input type="text" id="roomTopic" name="topic" placeholder="Enter room topic" required>
                </div>
                <div class="form-group">
                    <label for="roomCapacity">Room Capacity</label>
                    <input type="number" id="roomCapacity" name="capacity" placeholder="Enter maximum capacity" required>
                </div>
                <div class="form-group">
                    <label for="roomDescription">Room Description</label>
                    <textarea id="roomDescription" name="description" placeholder="Describe your study room" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Create Room</button>
            </form>
        </div>
    </div>
    <script>
        function toggleDropdown() {
            document.getElementById("userDropdown").classList.toggle("active");
        }

        // Close the dropdown if clicked outside
        window.onclick = function(event) {
            if (!event.target.matches('.user-profile') && !event.target.matches('.user-profile *')) {
                var dropdown = document.getElementById("userDropdown");
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            }
        }

        // Modal functions
        function openCreateRoomModal() {
            document.getElementById("createRoomModal").style.display = "block";
        }

        function closeCreateRoomModal() {
            document.getElementById("createRoomModal").style.display = "none";
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            var modal = document.getElementById("createRoomModal");
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
</body>
</html>
