<?php
require_once "../controllers/AuthController.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $auth = new AuthController();
    $message = $auth->login($_POST['email'], $_POST['password']);
    echo $message;
}

