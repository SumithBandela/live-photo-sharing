<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "mysql.hostinger.com";
$username = "u698690732_livephotoshare";
$password = "Rashmiphotography@6302";
$dbname = "u698690732_photoshare";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST['username']) || empty($_POST['username'])) {
        die(json_encode(["status" => "error", "message" => "Username is required."]));
    }

    if (!isset($_POST['title']) || empty($_POST['title'])) {
        die(json_encode(["status" => "error", "message" => "Album title is required."]));
    }

    if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
        die(json_encode(["status" => "error", "message" => "No images uploaded."]));
    }

    $username = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_POST['username']);
    $title = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_POST['title']);
    $uploadDir = "./images/" . $username . "/" . $title . "/";

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            die(json_encode(["status" => "error", "message" => "Failed to create album folder."]));
        }
    }

    $uploadedFiles = [];
    $totalFiles = count($_FILES['images']['name']);

    if ($totalFiles > 20) {
        die(json_encode(["status" => "error", "message" => "You can upload a maximum of 20 images at a time."]));
    }

    $stmt = $conn->prepare("INSERT INTO Photos (username, album_title, img_src) VALUES (?, ?, ?)");
    if (!$stmt) {
        die(json_encode(["status" => "error", "message" => "Database error: " . $conn->error]));
    }

    foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
        $originalName = pathinfo($_FILES['images']['name'][$key], PATHINFO_FILENAME);
        $extension = strtolower(pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION));

        $uniqueID = time() . "_" . rand(1000, 9999);
        $originalFileName = $originalName . "_" . $uniqueID . "." . $extension;
        $filePath = $uploadDir . $originalFileName;

        if ($extension === "webp") {
            if (move_uploaded_file($tmp_name, $filePath)) {
                $stmt->bind_param("sss", $username, $title, $filePath);
                $stmt->execute();
                $uploadedFiles[] = $filePath;
            }
            continue;
        }

        $webpPath = $uploadDir . $originalName . "_" . $uniqueID . ".webp";
        $image = null;

        switch ($extension) {
            case 'jpeg':
            case 'jpg':
                $image = imagecreatefromjpeg($tmp_name);
                break;
            case 'png':
                $image = imagecreatefrompng($tmp_name);
                break;
            case 'gif':
                $image = imagecreatefromgif($tmp_name);
                break;
            default:
                continue;
        }

        if ($image) {
            if (imagewebp($image, $webpPath, 80)) {
                imagedestroy($image);
                $stmt->bind_param("sss", $username, $title, $webpPath);
                $stmt->execute();
                $uploadedFiles[] = $webpPath;
            }
        }
    }

    $stmt->close();

    if (empty($uploadedFiles)) {
        die(json_encode(["status" => "error", "message" => "No images uploaded successfully."]));
    }

    echo json_encode(["status" => "success", "message" => "Images uploaded successfully!", "files" => $uploadedFiles]);

} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (isset($_GET['album']) && !empty($_GET['album']) && isset($_GET['username']) && !empty($_GET['username'])) {
        $album = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_GET['album']);
        $username = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_GET['username']);
        $stmt = $conn->prepare("SELECT id, img_src, is_visible FROM Photos WHERE username = ? AND album_title = ?");
        $stmt->bind_param("ss", $username, $album);
    } else {
        $stmt = $conn->prepare("SELECT * FROM Photos");
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $images = [];

    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }

    echo json_encode(["status" => "success", "images" => $images]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>
