<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$servername = "mysql.hostinger.com";
$username = "u698690732_livephotoshare";
$password = "Rashmiphotography@6302";
$dbname = "u698690732_photoshare";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = $_POST['title'] ?? "";
    $description = $_POST['description'] ?? "";
    $download = isset($_POST['download']) ? intval($_POST['download']) : 0;
    $isVisible = isset($_POST['isVisible']) ? intval($_POST['isVisible']) : 0;
    $username = $_POST['username'] ?? "";

    if (empty($title) || empty($username)) {
        echo json_encode(["status" => "error", "message" => "Title and Username are required"]);
        exit;
    }

    // Clean folder names
    $cleanUsername = preg_replace("/[^a-zA-Z0-9 _-]/", "", $username);
    $cleanTitle = preg_replace("/[^a-zA-Z0-9 _-]/", "", $title);

    // Set album folder path: backend/images/username/title/
    $albumFolder = "./images/$cleanUsername/$cleanTitle";

    if (!is_dir($albumFolder)) {
        mkdir($albumFolder, 0777, true);
    }

    // Set fixed thumbnail path
    $thumbnailPath = $albumFolder . "/thumbnail.webp";

    if (!empty($_FILES['thumbnail']['name'])) {
        $file = $_FILES['thumbnail'];
        $fileExt = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];

        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(["status" => "error", "message" => "Invalid image format"]);
            exit;
        }

        // Delete old thumbnail if exists
        if (file_exists($thumbnailPath)) {
            unlink($thumbnailPath);
        }

        // Convert uploaded image to WebP if needed
        if ($fileExt !== "webp") {
            $image = null;
            if ($fileExt == "jpg" || $fileExt == "jpeg") {
                $image = imagecreatefromjpeg($file["tmp_name"]);
            } elseif ($fileExt == "png") {
                $image = imagecreatefrompng($file["tmp_name"]);
                imagepalettetotruecolor($image);
                imagealphablending($image, false);
                imagesavealpha($image, true);
            } elseif ($fileExt == "gif") {
                $image = imagecreatefromgif($file["tmp_name"]);
            }

            if ($image) {
                imagewebp($image, $thumbnailPath, 80);
                imagedestroy($image);
            } else {
                echo json_encode(["status" => "error", "message" => "Image conversion failed"]);
                exit;
            }
        } else {
            move_uploaded_file($file["tmp_name"], $thumbnailPath);
        }
    }

    // Prepare Update Query
    if (file_exists($thumbnailPath)) {
        $relativeThumbnailPath = str_replace("../", "", $thumbnailPath);
        $sql = "UPDATE Albums SET description = ?, download = ?, is_visible = ?, thumbnail = ? WHERE title = ? AND username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siisss", $description, $download, $isVisible, $relativeThumbnailPath, $title, $username);
    } else {
        $sql = "UPDATE Albums SET description = ?, download = ?, is_visible = ? WHERE title = ? AND username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siiss", $description, $download, $isVisible, $title, $username);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Album updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database update failed"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
