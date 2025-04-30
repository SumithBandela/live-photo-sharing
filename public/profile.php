<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$hostname = "mysql.hostinger.com";
$db_username = "u698690732_livephotoshare";
$db_password = "Rashmiphotography@6302";
$database = "u698690732_photoshare";

$conn = new mysqli($hostname, $db_username, $db_password, $database);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Handle POST request (Update profile)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_GET['username']) ? $conn->real_escape_string($_GET['username']) : '';

    if (!empty($username)) {
        $caption = isset($_POST['caption']) ? $conn->real_escape_string($_POST['caption']) : '';
        $phone = isset($_POST['phone']) ? $conn->real_escape_string($_POST['phone']) : '';
        $whatsapp_link = isset($_POST['whatsapp_link']) ? $conn->real_escape_string($_POST['whatsapp_link']) : '';
        $facebook_link = isset($_POST['facebook_link']) ? $conn->real_escape_string($_POST['facebook_link']) : '';
        $instagram_link = isset($_POST['instagram_link']) ? $conn->real_escape_string($_POST['instagram_link']) : '';
        $email = isset($_POST['email']) ? $conn->real_escape_string($_POST['email']) : '';
        $address = isset($_POST['address']) ? $conn->real_escape_string($_POST['address']) : '';

        $logo_url = '';
        if (isset($_FILES['logo']['tmp_name']) && is_uploaded_file($_FILES['logo']['tmp_name'])) {
            $imagePath = $_FILES['logo']['tmp_name'];
            $imageInfo = getimagesize($imagePath);

            if ($imageInfo) {
                $mime = $imageInfo['mime'];
                switch ($mime) {
                    case 'image/jpeg':
                        $image = imagecreatefromjpeg($imagePath);
                        break;
                    case 'image/png':
                        $image = imagecreatefrompng($imagePath);
                        break;
                    default:
                        echo json_encode(['error' => 'Unsupported image format. Only JPEG and PNG are allowed.']);
                        exit;
                }

                $userDir = "images/$username";
                if (!file_exists($userDir)) {
                    mkdir($userDir, 0777, true);
                }

                $logo_url = "$userDir/logo.webp";
                imagewebp($image, $logo_url, 80);
                imagedestroy($image);
            } else {
                echo json_encode(['error' => 'Invalid image file']);
                exit;
            }
        }

        $updateFields = [
            "caption = '$caption'",
            "phone = '$phone'",
            "whatsapp_link = '$whatsapp_link'",
            "facebook_link = '$facebook_link'",
            "instagram_link = '$instagram_link'",
            "email = '$email'",
            "address = '$address'"
        ];

        if (!empty($logo_url)) {
            $logo_url_escaped = $conn->real_escape_string($logo_url);
            $updateFields[] = "logo_url = '$logo_url_escaped'";
        }

        $sql = "UPDATE profile SET " . implode(', ', $updateFields) . " WHERE username = '$username'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => 'Profile updated successfully']);
        } else {
            echo json_encode(['error' => 'Failed to update profile: ' . $conn->error]);
        }
    } else {
        echo json_encode(['error' => 'Username is required in URL']);
    }
}

// Handle GET request (Fetch profile)
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

// Invalid request method
else {
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>
