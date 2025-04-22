<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Study Room -9arrini</title>
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

        .button {
            background-color: #34bfa3;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-bottom: 20px;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1;
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
            padding: 40px;
            border: 1px solid #888;
            width: 80%;
            border-radius: 40px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        textarea {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: vertical;
        }
    </style>
</head>
<body>

<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Create a New Study Room</h2>
        <form action="create_room.php" method="POST">
            <label for="roomName"><strong>Room Name</strong>:</label>
            <input type="text" id="roomName" name="name" placeholder="Room Name" required>
            
            <label for="roomTopic"><strong>Room Topic</strong>:</label>
            <input type="text" id="roomTopic" name="topic" placeholder="Room Topic" required>
            
            <label for="roomCapacity"><strong>Room Capacity</strong>:</label>
            <input type="number" id="roomCapacity" name="capacity" placeholder="Room Capacity" required>
            
            <label for="roomDescription"><strong>Room Description:</strong></label>
            <textarea id="roomDescription" name="description" placeholder="Enter room description" rows="4" required></textarea>
            
            <button type="submit" class="button" id="submitRoom">Create Room</button>
        </form>
    </div>
</div>

<script>
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    
    // Show modal by default
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
        window.location.href = "dashboard.php";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "dashboard.php";
        }
    }
</script>

</body>
</html>