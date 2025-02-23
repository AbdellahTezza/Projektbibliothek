<?php
session_start();

$pages = [
    "dashboard_admin" => __DIR__ . "/public/dashboard_admin.html",
    "books" => __DIR__ . "/public/books.html",
    "bucherverwaltung" => __DIR__ . "/public/bucherverwaltung.html",
    "schuler" => __DIR__ . "/public/schuler.html",
    "dashboard" => __DIR__ . "/public/dashboard.html",
    "bucher" => __DIR__ . "/public/bucher.html",
    "meine_ausleihen" => __DIR__ . "/public/meine_ausleihen.html",
    "meine_ausgeliehenen_buecher" => __DIR__ . "/public/meine_ausgeliehenen_buecher.html",
];


if (!isset($_GET['page'])) {
    if ($_SESSION['role'] === 'admin') {

        header("Location: /public/dashboard_admin.html");
        exit();
    } else {

        header("Location: /public/dashboard.html");
        exit();
    }
} else {
    $page = $_GET['page'];
}

if (!isset($_SESSION['schueler_id']) && $page !== "login") {
    header("Location: /public/login.html");
    exit();
}

if (array_key_exists($page, $pages)) {
    include $pages[$page]; 
}else{
        if ($_SESSION['role'] === 'admin') {
        $page = "dashboard_admin";
    } else {
        $page = "dashboard";
    }
} 



?>
