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

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (isset($_GET['slug']) && !empty($_GET['slug'])) {
        $slug = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_GET['slug']);

        // Step 1: Fetch album details from Albums table including download field
        $stmt1 = $conn->prepare("SELECT title, description, username, download FROM Albums WHERE slug = ?");
        $stmt1->bind_param("s", $slug);
        $stmt1->execute();
        $result1 = $stmt1->get_result();

        if ($result1->num_rows > 0) {
            $album = $result1->fetch_assoc();
            $title = $album['title'];
            $description = $album['description'];
            $username = $album['username'];
            $download = $album['download']; // Fetch download setting
            $stmt1->close();

            // Step 2: Fetch images from Photos table including visibility (is_visible)
            $stmt2 = $conn->prepare("SELECT img_src, is_visible FROM Photos WHERE album_title = ? AND username = ?");
            $stmt2->bind_param("ss", $title, $username);
            $stmt2->execute();
            $result2 = $stmt2->get_result();

            $images = [];
            while ($row = $result2->fetch_assoc()) {
                $images[] = [
                    "img_src" => $row['img_src'],
                    "is_visible" => $row['is_visible'] // Fetch visibility for each photo
                ];
            }
            $stmt2->close();

            // Response with album info + image list including visibility and download info
            echo json_encode([
                "status" => "success",
                "album" => [
                    "title" => $title,
                    "description" => $description,
                    "username" => $username,
                    "download" => $download, // Include download setting from album
                    "images" => $images
                ]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Album not found for the provided slug."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Slug is required."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn->close();
?>
