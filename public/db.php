<?php
// Database connection details
$hostname = 'mysql.hostinger.com';      // Replace with your database host (e.g., localhost)
$username = 'u698690732_livephotoshare';      // Replace with your MySQL username
$password = 'Rashmiphotography@6302';      // Replace with your MySQL password
$databaseName = 'u698690732_photoshare';  // Replace with your database name

// Create connection
$conn = new mysqli($hostname, $username, $password, $databaseName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
