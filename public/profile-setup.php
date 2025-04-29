<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database credentials
$hostname = "mysql.hostinger.com";
$db_username = "u698690732_livephotoshare";
$db_password = "Rashmiphotography@6302";
$database = "u698690732_photoshare";

// Create DB connection
$conn = new mysqli($hostname, $db_username, $db_password, $database);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Required
    $username = $_GET['username'] ?? '';
    if (!$username) {
        echo json_encode(['error' => 'Username is required']);
        exit;
    }

    // Optional fields
    $caption = $_POST['caption'] ?? '';
    $whatsapp = $_POST['whatsapp_link'] ?? '';
    $instagram = $_POST['instagram_link'] ?? '';
    $facebook = $_POST['facebook_link'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $logo_url = '';
    $studioname = $_POST['studio_name'] ?? '';
    // Create user image folder
    $folder = "images/$username";
    if (!file_exists($folder)) {
        mkdir($folder, 0755, true);
    }

    // Handle image upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === 0) {
        $tmp = $_FILES['logo']['tmp_name'];
        $info = getimagesize($tmp);
        $mime = $info['mime'];
        $webpPath = "$folder/logo.webp";

        $shouldConvert = true;
        switch ($mime) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = imagecreatefromjpeg($tmp);
                break;
            case 'image/png':
                $image = imagecreatefrompng($tmp);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($tmp);
                break;
            case 'image/bmp':
                $image = imagecreatefrombmp($tmp);
                break;
            case 'image/webp':
                $shouldConvert = false;
                move_uploaded_file($tmp, $webpPath);
                break;
            default:
                echo json_encode(['error' => 'Unsupported image format']);
                exit;
        }

        if ($shouldConvert && isset($image)) {
            imagewebp($image, $webpPath, 80);
            imagedestroy($image);
        }

        $logo_url = "$webpPath";
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO profile (username, logo_url, caption, whatsapp_link, instagram_link, facebook_link, phone, email, address, studio_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssss", $username, $logo_url, $caption, $whatsapp, $instagram, $facebook, $phone, $email, $address, $studioname);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Profile saved successfully', 'logo_url' => $logo_url]);
    } else {
        echo json_encode(['error' => 'Insert failed: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

echo json_encode(['error' => 'Invalid request method']);
?>
