<?php
session_start();
session_unset();
session_destroy();
echo "Logged out successfully.";
header("Location: login.php");
exit;
?>
