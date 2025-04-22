<?php
require_once 'config.php';

$conn = getConnection();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["action"])) {
        $action = $_POST["action"];

        switch ($action) {
            case "add":
                if (isset($_POST["task"])) {
                    $task = $conn->real_escape_string($_POST["task"]);
                    $sql = "INSERT INTO todos (task) VALUES ('$task')";

                    if ($conn->query($sql) === TRUE) {
                        echo "New record created successfully";
                    } else {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                }
                break;

            case "toggle":
                if (isset($_POST["id"])) {
                    $id = $conn->real_escape_string($_POST["id"]);
                    $sql = "UPDATE todos SET completed = NOT completed WHERE id = $id";

                    if ($conn->query($sql) === TRUE) {
                        echo "Record updated successfully";
                    } else {
                        echo "Error updating record: " . $conn->error;
                    }
                }
                break;
        }
    }
}

$conn->close();
?>