<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connect to database
$conn = new mysqli("mysql.hostinger.com", "u698690732_livephotoshare", "Rashmiphotography@6302", "u698690732_photoshare");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? '';
$password = $data["password"] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Username and password required"]);
    exit();
}

// Fetch user by username
$stmt = $conn->prepare("SELECT id, password FROM Users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $hashedPassword = $user['password'];

    // Verify password
    if (password_verify($password, $hashedPassword)) {
        echo json_encode([
            "success" => true,
            "username" => $username
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
?>
