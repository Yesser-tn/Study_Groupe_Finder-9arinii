<?php
// Configurer la connexion à la base de données
$host = 'localhost';
$dbname = '9arrini_db';  // Nom de la base de données
$username = 'root';      // Nom d'utilisateur de la base de données
$password = '';          // Mot de passe de la base de données

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>