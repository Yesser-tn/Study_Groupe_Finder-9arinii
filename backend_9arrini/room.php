<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Get room ID from URL
$room_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$room_id) {
    header("Location: dashboard.php");
    exit;
}

// Get room information with creator details and participant count
$stmt = $conn->prepare("
    SELECT r.*, u.username as creator_username, u.profile_pic as creator_pic, 
    (SELECT COUNT(*) FROM room_participants WHERE room_id = r.id) as joined_count,
    TIMESTAMPDIFF(MINUTE, r.created_at, NOW()) as minutes_ago
    FROM study_rooms r
    JOIN users u ON r.created_by = u.id
    WHERE r.id = ?
");
$stmt->bind_param("i", $room_id);
$stmt->execute();
$room = $stmt->get_result()->fetch_assoc();

if (!$room) {
    header("Location: dashboard.php");
    exit;
}

// Get current user's information
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$current_user = $stmt->get_result()->fetch_assoc();

// Get room participants
$stmt = $conn->prepare("
    SELECT u.id, u.username, u.profile_pic 
    FROM users u
    JOIN room_participants rp ON u.id = rp.user_id
    WHERE rp.room_id = ?
    ORDER BY rp.joined_at
");
$stmt->bind_param("i", $room_id);
$stmt->execute();
$participants = $stmt->get_result();

// Function to format time ago
function getTimeAgo($minutes) {
    if ($minutes < 60) {
        return $minutes . " minutes ago";
    } else if ($minutes < 1440) {
        $hours = floor($minutes / 60);
        return $hours . " hours ago";
    } else {
        $days = floor($minutes / 1440);
        return $days . " days ago";
    }
}

// Check if current user is a participant
$stmt = $conn->prepare("
    SELECT * FROM room_participants 
    WHERE room_id = ? AND user_id = ?
");
$stmt->bind_param("ii", $room_id, $_SESSION['user_id']);
$stmt->execute();
$is_participant = $stmt->get_result()->fetch_assoc() !== null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($room['name']); ?> - 9arrini</title>
    <link rel="icon" href="logo.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
            background-color: #f4f4f4;
            color: #333;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .container {
            flex: 1;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 2.5fr 1fr;
            gap: 20px;
            height: calc(100vh - 40px);
        }

        .main-content {
            display: grid;
            grid-template-rows: auto 1fr;
            gap: 20px;
        }

        .room-details {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .room-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .creator-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
            object-fit: cover;
        }

        .room-name {
            font-size: 1.8em;
            color: #00BFA5;
            margin-bottom: 10px;
        }

        .room-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .room-description {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .tools-container {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        }

        .tools-header {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tool-tab {
            padding: 10px 20px;
            border: none;
            background: #f1f1f1;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }

        .tool-tab.active {
            background: #00BFA5;
            color: white;
        }

        .tool-content {
            flex: 1;
            display: none;
        }

        .tool-content.active {
            display: block;
        }

        .timer-container {
            text-align: center;
            padding: 20px;
        }

        .timer-display {
            font-size: 3em;
            font-weight: bold;
            margin: 20px 0;
            color: #00BFA5;
        }

        .timer-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .timer-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }

        .timer-btn.start {
            background: #00BFA5;
            color: white;
        }

        .timer-btn.reset {
            background: #ff5252;
            color: white;
        }

        .whiteboard-container {
            height: 100%;
            min-height: 400px;
            border: 2px solid #eee;
            border-radius: 8px;
        }

        .chat-container {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 80%;
        }

        .message.sent {
            background: #00BFA5;
            color: white;
            margin-left: auto;
        }

        .message.received {
            background: #e9ecef;
        }

        .chat-input {
            display: flex;
            gap: 10px;
        }

        .chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }

        .chat-input button {
            padding: 10px 20px;
            background: #00BFA5;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
        }

        .participants {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-height: calc(100vh - 40px);
            overflow-y: auto;
        }

        .participant-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .participant {
            display: flex;
            align-items: center;
            background: #f1f1f1;
            padding: 8px 12px;
            border-radius: 20px;
        }

        .participant img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
            object-fit: cover;
        }

        .leave-btn {
            background-color: #ff5252;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .leave-btn:hover {
            background-color: #ff3030;
        }

        .topic-badge {
            background-color: #00BFA5;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }

        @media (max-width: 1024px) {
            .container {
                grid-template-columns: 1fr;
            }
            
            .participants {
                max-height: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-content">
            <div class="room-details">
                <div class="room-header">
                    <img src="<?php echo htmlspecialchars($room['creator_pic']); ?>" 
                         alt="Creator Profile" class="creator-pic">
                    <div>
                        <div>Created by @<?php echo htmlspecialchars($room['creator_username']); ?></div>
                        <small><?php echo getTimeAgo($room['minutes_ago']); ?></small>
                    </div>
                </div>

                <h1 class="room-name"><?php echo htmlspecialchars($room['name']); ?></h1>

                <div class="room-meta">
                    <span class="topic-badge"><?php echo htmlspecialchars($room['topic']); ?></span>
                    <div>
                        <?php if ($is_participant): ?>
                            <a href="leave_room.php?id=<?php echo $room_id; ?>" 
                               class="leave-btn" 
                               onclick="return confirm('Are you sure you want to leave this room?')">
                                Leave Room
                            </a>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="room-description">
                    <h3>Room Description</h3>
                    <p><?php echo htmlspecialchars($room['description']); ?></p>
                </div>
            </div>

            <div class="tools-container">
                <div class="tools-header">
                    <button class="tool-tab active" data-tool="timer">Pomodoro Timer</button>
                    <button class="tool-tab" data-tool="whiteboard">Whiteboard</button>
                    <button class="tool-tab" data-tool="chat">Chat</button>
                </div>

                <div class="tool-content active" id="timer">
                    <div class="timer-container">
                        <h3>Pomodoro Timer</h3>
                        <div class="timer-display">25:00</div>
                        <div class="timer-controls">
                            <button class="timer-btn start">Start</button>
                            <button class="timer-btn reset">Reset</button>
                        </div>
                    </div>
                </div>

                <div class="tool-content" id="whiteboard">
                    <div class="whiteboard-container">
                        <canvas id="whiteboard"></canvas>
                    </div>
                </div>

                <div class="tool-content" id="chat">
                    <div class="chat-container">
                        <div class="chat-messages" id="chatMessages">
                            <!-- Messages will be added here dynamically -->
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Type your message..." id="messageInput">
                            <button id="sendMessage">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="participants">
            <h3>Room Participants (<?php echo $room['joined_count']; ?>/<?php echo $room['capacity']; ?>)</h3>
            <div class="participant-list">
                <?php while ($participant = $participants->fetch_assoc()): ?>
                    <div class="participant">
                        <img src="<?php echo htmlspecialchars($participant['profile_pic']); ?>" 
                             alt="Participant Profile">
                        <span><?php echo htmlspecialchars($participant['username']); ?></span>
                    </div>
                <?php endwhile; ?>
            </div>
        </div>
    </div>

    <script>
        // Tool tabs switching
        const toolTabs = document.querySelectorAll('.tool-tab');
        const toolContents = document.querySelectorAll('.tool-content');

        toolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tool = tab.dataset.tool;
                
                // Update active tab
                toolTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                toolContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tool) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Pomodoro Timer
        let timerInterval;
        let timeLeft = 25 * 60; // 25 minutes in seconds
        const timerDisplay = document.querySelector('.timer-display');
        const startBtn = document.querySelector('.timer-btn.start');
        const resetBtn = document.querySelector('.timer-btn.reset');

        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        startBtn.addEventListener('click', () => {
            if (startBtn.textContent === 'Start') {
                startBtn.textContent = 'Pause';
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    if (timeLeft === 0) {
                        clearInterval(timerInterval);
                        alert('Time is up!');
                        timeLeft = 25 * 60;
                        updateTimerDisplay();
                        startBtn.textContent = 'Start';
                    }
                }, 1000);
            } else {
                startBtn.textContent = 'Start';
                clearInterval(timerInterval);
            }
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timeLeft = 25 * 60;
            updateTimerDisplay();
            startBtn.textContent = 'Start';
        });

        // Whiteboard
        const canvas = document.getElementById('whiteboard');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function draw(e) {
            if (!isDrawing) return;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        // Chat functionality
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');
        const chatMessages = document.getElementById('chatMessages');

        function addMessage(message, isSent = true) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(isSent ? 'sent' : 'received');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                addMessage(message);
                messageInput.value = '';
                // Here you would typically send the message to the server
            }
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });

        // Simulate receiving messages (for demonstration)
        setTimeout(() => {
            addMessage('Welcome to the study room!', false);
        }, 1000);
    </script>
</body>
</html>