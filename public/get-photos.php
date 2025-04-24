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
    // Check if both album title and username are provided
    if (isset($_GET['album']) && !empty($_GET['album']) && isset($_GET['username']) && !empty($_GET['username'])) {
        $album = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_GET['album']);
        $username = preg_replace("/[^a-zA-Z0-9 _-]/", "", $_GET['username']);
        
        // Prepare SQL query to fetch photos based on username and album title
        $stmt = $conn->prepare("SELECT is_visible, img_src FROM Photos WHERE username = ? AND album_title = ?");
        $stmt->bind_param("ss", $username, $album);
        
        $stmt->execute();
        $result = $stmt->get_result();
        $images = [];

        // Fetch and store both is_visible and img_src in an array
        while ($row = $result->fetch_assoc()) {
            $images[] = [
                'is_visible' => $row['is_visible'],
                'img_src' => $row['img_src']
            ];
        }

        // Return the images as a single array in JSON format
        echo json_encode(["status" => "success", "images" => $images]);
        $stmt->close();
    } else {
        // Return error if album or username is missing
        echo json_encode(["status" => "error", "message" => "Album title and username are required."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>
