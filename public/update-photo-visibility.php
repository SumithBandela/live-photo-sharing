<?php
// ✅ CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Replace * with specific origin if needed
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// ✅ Hostinger DB credentials
$host = 'mysql.hostinger.com';
$dbname = 'u698690732_photoshare';
$username = 'u698690732_livephotoshare';
$password = 'Rashmiphotography@6302';

// ✅ Connect to MySQL database using PDO
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

// ✅ Read and validate input
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['url'], $data['visible'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
    exit;
}

$url = $data['url'];
$visible = $data['visible'] ? 1 : 0;

try {
    $stmt = $conn->prepare("UPDATE Photos SET is_visible = ? WHERE img_src = ?");
    $stmt->execute([$visible, $url]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Visibility updated']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No changes made or photo not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
