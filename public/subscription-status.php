<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Get the username from the query string
$username = $_GET['username'] ?? null;

if (!$username) {
    echo json_encode(["error" => "Username is required"]);
    exit;
}

$host = 'mysql.hostinger.com';
$dbname = 'u698690732_photoshare';
$user = 'u698690732_livephotoshare';
$pass = 'Rashmiphotography@6302';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch subscription status based on the username
    $stmt = $pdo->prepare("SELECT status FROM Subscriptions WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Return the subscription status directly
        echo json_encode(["subscription_status" => $result['status']]);  // Correct the key here
    } else {
        // If the subscription is not found for the given username
        echo json_encode(["subscription_status" => "not_found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
