<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database credentials
$servername = "mysql.hostinger.com";
$username = "u698690732_livephotoshare";
$password = "Rashmiphotography@6302";
$database = "u698690732_photoshare";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed", "error" => $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['name'], $input['username'], $input['password'])) {
        echo json_encode(["success" => false, "message" => "Missing name, username, or password"]);
        exit;
    }

    $name = $input['name'];
    $username_new = $input['username'];
    $plain_password = $input['password'];

    // Hash password
    $hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

    // Create user folder
    $user_folder_path = __DIR__ . "/images/" . $username_new;
    if (!file_exists($user_folder_path)) {
        if (!mkdir($user_folder_path, 0777, true)) {
            echo json_encode(["success" => false, "message" => "Failed to create user folder"]);
            exit;
        }
    }

    // Insert user into DB
    $stmt = $conn->prepare("INSERT INTO Users (name, username, password) VALUES (?, ?, ?)");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare failed", "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("sss", $name, $username_new, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to register user", "error" => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
