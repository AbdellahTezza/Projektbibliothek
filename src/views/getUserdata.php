<?php

require_once "../controllers/AuthController.php";

$authController = new AuthController(Database::getConnection());


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'role') {
    $result = $authController->getUserdata();
    echo json_encode($result);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateUserdata') {
    $result = $authController->updateUserdata();
    echo json_encode($result);
}
?>
