<?php
session_start();

$isLoggedIn = isset($_SESSION["role"]) && isset($_SESSION["vorname"]) && isset($_SESSION["nachname"]);

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_destroy();
    echo json_encode(["message" => "Erfolgreich abgemeldet."]);
    exit; 
}

if ($isLoggedIn) {
    echo json_encode([
        "loggedIn" => true,
        "role" => $_SESSION["role"],
        "vorname" => $_SESSION["vorname"],
        "nachname" => $_SESSION["nachname"]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
exit;
?>

