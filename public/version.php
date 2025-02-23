<?php
// Get PHP version
$phpVersion = phpversion();

// Connect to MySQL and get version
$mysqli = new mysqli("127.0.0.1:4306", "root", ""); // Change credentials if needed
$mysqlVersion = $mysqli->server_info;
$mysqli->close();

// Display the versions
echo "Ich nutze derzeit:<br>";
echo "- PHP-Version: ≥ " . $phpVersion . "<br>";
echo "- MySQL-Version: ≥ " . $mysqlVersion;
?>
