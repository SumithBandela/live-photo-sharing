<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

// Database connection
$conn = new mysqli("mysql.hostinger.com", "u698690732_livephotoshare", "Rashmiphotography@6302", "u698690732_photoshare");
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Handle GET request
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $query = "SELECT id, title, description, slug, thumbnail, download, is_visible, watermark FROM Albums";
    $params = [];
    $types = '';

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $query .= " WHERE id = ?";
        $params[] = $id;
        $types .= "i";
    } elseif (isset($_GET['username'])) {
        $username = $_GET['username'];
        $query .= " WHERE thumbnail LIKE ?";
        $params[] = "%images/" . $username . "/%";
        $types .= "s";
    } elseif (isset($_GET['title'])) {
        $title = $_GET['title'];
        $query .= " WHERE title = ?";
        $params[] = $title;
        $types .= "s";
    }

    if (!empty($params)) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }

    $albums = [];
    while ($row = $result->fetch_assoc()) {
        $albums[] = $row;
    }

    echo json_encode(["status" => "success", "albums" => $albums]);
    $conn->close();
    exit();
}

// Handle POST (Upload Album)
$title = $_POST['title'] ?? null;
$description = $_POST['description'] ?? null;
$username = $_POST['username'] ?? null;
$slug = $_POST['slug'] ?? '';
$download = isset($_POST['download']) ? (bool)$_POST['download'] : false;
$isVisible = isset($_POST['isVisible']) ? (bool)$_POST['isVisible'] : false;
$watermark = $_POST['watermark'] ?? '';

// Sanitize slug
$slug = preg_replace("/[^a-z0-9-]/", "", strtolower(trim($slug)));

if (!$title || !$description || !$username || !$slug) {
    die(json_encode(["status" => "error", "message" => "Title, description, username, and slug are required."]));
}

// Check for duplicate slug
$checkSlug = $conn->prepare("SELECT id FROM Albums WHERE slug = ?");
$checkSlug->bind_param("s", $slug);
$checkSlug->execute();
$checkSlug->store_result();

if ($checkSlug->num_rows > 0) {
    die(json_encode(["status" => "error", "message" => "Slug already exists. Please use a different title."]));
}
$checkSlug->close();

// Validate thumbnail upload
if (!isset($_FILES["thumbnail"]) || $_FILES["thumbnail"]["error"] !== UPLOAD_ERR_OK) {
    die(json_encode(["status" => "error", "message" => "Thumbnail upload failed. Error Code: " . $_FILES["thumbnail"]["error"]]));
}

// Set paths
$uploadBaseDir = __DIR__ . "/images/";
$cleanUsername = preg_replace("/[^a-zA-Z0-9_-]/", "", $username);
$cleanTitle = preg_replace("/[^a-zA-Z0-9_-]/", "", $title);

$userDir = $uploadBaseDir . $cleanUsername . "/";
$albumDir = $userDir . $cleanTitle . "/";

if (!file_exists($albumDir)) {
    mkdir($albumDir, 0777, true);
}

$targetPath = $albumDir . "thumbnail.webp";
$relativePath = "images/" . $cleanUsername . "/" . $cleanTitle . "/thumbnail.webp";

// Validate image type
$fileType = strtolower(pathinfo($_FILES["thumbnail"]["name"], PATHINFO_EXTENSION));
$allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];

if (!in_array($fileType, $allowedFormats)) {
    die(json_encode(["status" => "error", "message" => "Invalid file format. Allowed: JPG, JPEG, PNG, GIF, WEBP."]));
}

// Convert or move to WebP
if ($fileType === "webp") {
    if (!move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $targetPath)) {
        die(json_encode(["status" => "error", "message" => "Failed to upload WebP file."]));
    }
} else {
    switch ($fileType) {
        case "jpg":
        case "jpeg":
            $image = imagecreatefromjpeg($_FILES["thumbnail"]["tmp_name"]);
            break;
        case "png":
            $image = imagecreatefrompng($_FILES["thumbnail"]["tmp_name"]);
            break;
        case "gif":
            $image = imagecreatefromgif($_FILES["thumbnail"]["tmp_name"]);
            break;
        default:
            die(json_encode(["status" => "error", "message" => "Unsupported image type."]));
    }

    if (!$image || !imagewebp($image, $targetPath, 80)) {
        die(json_encode(["status" => "error", "message" => "Failed to convert image to WebP."]));
    }

    imagedestroy($image);
}

// Insert into DB with slug
$stmt = $conn->prepare("INSERT INTO Albums (title, description, slug, thumbnail, download, is_visible, watermark, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssisss", $title, $description, $slug, $relativePath, $download, $isVisible, $watermark, $username);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Album added successfully!",
        "thumbnail" => $relativePath,
        "slug" => $slug
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Database insert failed."]);
}

$stmt->close();
$conn->close();
?>
