<?php
require_once "../controllers/AuthController.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $auth = new AuthController();
    $message = $auth->register($_POST['vorname'], $_POST['nachname'], $_POST['email'], $_POST['password'], $_POST['userType']);
    echo $message;
}

?>
