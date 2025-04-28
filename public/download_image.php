<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_GET['username']) && isset($_GET['title']) && isset($_GET['img_src'])) {
    $username = basename($_GET['username']);
    $title = basename($_GET['title']);
    $img_src = basename($_GET['img_src']);

    $file_path = __DIR__ . "/images/$username/$title/$img_src";

    if (file_exists($file_path)) {
        $mime_type = mime_content_type($file_path);
        header('Content-Type: ' . $mime_type);
        header('Content-Length: ' . filesize($file_path));
        readfile($file_path);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "File not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Required parameters are missing."]);
}
?>
