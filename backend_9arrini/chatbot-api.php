<?php
// This file handles the API requests to the t3alem.tn/chatbot service

// Allow cross-origin requests (if needed)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Check if message is provided
if (!isset($data['message']) || empty($data['message'])) {
    echo json_encode(['response' => 'You need to provide messages!']);
    exit;
}

// Send request to t3alem.tn/chatbot
$message = $data['message'];
$response = getChatbotResponse($message);

// Output the response
echo $response;

// Function to fetch chatbot response from t3alem.tn/chatbot
function getChatbotResponse($message) {
    $url = 'https://t3alem.tn/chatbot';
    
    // Initialize cURL session
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['message' => $message]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Execute cURL session and get the response
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        $response = json_encode(['error' => curl_error($ch)]);
    }
    
    // Close cURL session
    curl_close($ch);
    
    // If response is not valid JSON, wrap it in a JSON object
    if ($response && !isJson($response)) {
        $response = json_encode(['response' => $response]);
    }
    
    return $response ?: json_encode(['error' => 'Unable to connect to chatbot service']);
}

// Function to check if a string is valid JSON
function isJson($string) {
    json_decode($string);
    return json_last_error() === JSON_ERROR_NONE;
}
?>