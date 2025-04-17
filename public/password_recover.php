<?php
// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// DB credentials
$servername = "mysql.hostinger.com";
$username = "u698690732_livephotoshare";
$password = "Rashmiphotography@6302";
$database = "u698690732_photoshare";

// DB connection
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed", "error" => $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $username_param = isset($_GET['username']) ? $_GET['username'] : null;

    if ($username_param) {
        $stmt = $conn->prepare("SELECT * FROM Users WHERE username = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Prepare failed", "error" => $conn->error]);
            exit;
        }

        $stmt->bind_param("s", $username_param);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            echo json_encode(["success" => true, "exists" => true]);
        } else {
            echo json_encode(["success" => false, "exists" => false, "message" => "User not found"]);
        }

        $stmt->close();
    } else {
        $sql = "SELECT * FROM Users";
        $result = $conn->query($sql);

        $users = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode(["success" => true, "data" => $users]);
        } else {
            echo json_encode(["success" => false, "message" => "No users found"]);
        }
    }

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['username'], $input['password'])) {
        echo json_encode(["success" => false, "message" => "Username and new password required"]);
        exit;
    }

    $username_param = $input['username'];
    $plain_password = $input['password'];

    // ✅ Hash the password
    $hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("UPDATE Users SET password = ? WHERE username = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare failed", "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("ss", $hashed_password, $username_param);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Password updated successfully (hashed)"]);
        } else {
            echo json_encode(["success" => false, "message" => "Username not found or password unchanged"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Update failed", "error" => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
