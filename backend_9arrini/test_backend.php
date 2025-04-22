<?php
function send_post($url, $data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/backend/" . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_POST, true);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo "Error: " . curl_error($ch) . "\n";
        return null;
    }
    
    curl_close($ch);
    return $response;
}

function assert_response($response, $success_keywords, $failure_keywords, $test_name) {
    if (strpos($response, $success_keywords) !== false) {
        echo "❌ $test_name failed: Response indicates success when it should not.\n";
    } else {
        echo "✅ $test_name passed.\n";
    }
}

function test_signup_login() {
    echo "\n🔹 Test Inscription : ";
    $signup = send_post("signup.php", [
        'full_name' => 'test_user',
        'email' => 'test_user@example.com',
        'password' => 'test123',
        'confirm_password' => 'test123'
    ]);
    assert_response($signup, "succès", "error", "Signup");
}
function test_login_success() {
    echo "\n🔹 Test Connexion  : ";
    $login = send_post("login.php", [
        'email' => 'test_user@example.com', 
        'password' => 'test123'
    ]);
    assert_response($login, "Location: dashboard.php", "Invalid email or password", "Login Success");
}

// function test_create_room() {
//     echo "\n🔹 Test Création de Salle : ";
//     $create = send_post("create_room.php", [
//         'room_name' => 'SalleTest',
//         'description' => 'Salle de test automatique'
//     ]);
//     assert_response($create, "succès", "error", "Room Creation");
// }
function test_create_room_success() {
    echo "🔹 Test Création de Salle (Success) : ";
    $create = send_post("create_room.php", [
        'name' => 'SalleTest',
        'capacity' => 10,
        'description' => 'Salle de test automatique',
        'topic' => 'Test Topic'
    ]);
    assert_response($create, "Study room created successfully", "Error creating study room", "Room Creation Success");
}

function test_todo_add() {
    echo "🔹 Test Ajout de Tâche (TODO) : ";
    $add = send_post("todo-actions.php", [
        'action' => 'add',
        'task' => 'Faire les tests',
        'due_date' => date("Y-m-d")
    ]);
    assert_response($add, "success", "error", "Todo Addition");
}

echo "\n=== 🔍 Lancement des Tests Automatiques ===\n";
test_signup_login();
test_login_success();
test_create_room_success();
test_todo_add();
echo "=== ✅ Tests terminés ===\n";
?>