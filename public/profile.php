<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Show errors (for debugging)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$hostname = "mysql.hostinger.com";
$db_username = "u698690732_livephotoshare";
$db_password = "Rashmiphotography@6302";
$database = "u698690732_photoshare";

$conn = new mysqli($hostname, $db_username, $db_password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Handle POST request (Update profile)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!empty($data['username'])) {
        $username = $conn->real_escape_string($data['username']);
        $logo_url = isset($data['logo_url']) ? $conn->real_escape_string($data['logo_url']) : '';
        $caption = isset($data['caption']) ? $conn->real_escape_string($data['caption']) : '';
        $phone = isset($data['phone']) ? $conn->real_escape_string($data['phone']) : '';
        $whatsapp_link = isset($data['whatsapp_link']) ? $conn->real_escape_string($data['whatsapp_link']) : '';
        $facebook_link = isset($data['facebook_link']) ? $conn->real_escape_string($data['facebook_link']) : '';
        $instagram_link = isset($data['instagram_link']) ? $conn->real_escape_string($data['instagram_link']) : '';
        $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
        $address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';

        $sql = "UPDATE profile SET 
            logo_url = '$logo_url',
            caption = '$caption',
            phone = '$phone',
            whatsapp_link = '$whatsapp_link',
            facebook_link = '$facebook_link',
            instagram_link = '$instagram_link',
            email = '$email',
            address = '$address'
            WHERE username = '$username'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => 'Profile updated successfully']);
        } else {
            echo json_encode(['error' => 'Failed to update profile: ' . $conn->error]);
        }
    } else {
        echo json_encode(['error' => 'Username is required']);
    }
}

// Handle GET request (Fetch profile details)
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!empty($_GET['username'])) {
        $username = $conn->real_escape_string($_GET['username']);
        $sql = "SELECT * FROM profile WHERE username = '$username'";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            echo json_encode(['error' => 'Profile not found']);
        }
    } else {
        echo json_encode(['error' => 'Username parameter missing']);
    }
}

// Other methods
else {
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>
