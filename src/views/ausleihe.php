<?php
session_start();  
require_once "../controllers/AusleiheController.php";

$ausleiheModel = new AusleiheController(Database::getConnection());


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    // Fall: Ein Buch ausleihen
    if ($_POST['action'] === 'borrow') {
        $buchId = $_POST['buch_id'];
        $schuelerId = $_POST['schueler_id'];
        echo json_encode($ausleiheModel->borrowBook($buchId, $schuelerId));
        exit;
    }

    // Fall: Ein Buch zurückgeben
    if ($_POST['action'] === 'return') {
        $buchId = $_POST['buch_id'];
        $schuelerId = isset($_POST['schueler_id']) ? $_POST['schueler_id'] : $_SESSION['schueler_id'];
        echo json_encode($ausleiheModel->returnBook($buchId, $schuelerId));
        exit;
    }
}

if (isset($_GET['action']) && $_GET['action'] == 'getCounts') {
    // Ruft die Methode auf, um die Anzahl der Ausleihen, Bücher und Schüler abzurufen
    $ausleiheModel->getCounts();
}

if (isset($_GET['action']) && $_GET['action'] == 'getCountsschuler') {
    $schueler_id = $_SESSION['schueler_id'] ?? null;
    // Methode zur Abrufung der Zählerwerte für den Schüler aufrufen
    $ausleiheModel->getCountsschuler($schueler_id);
}

if (isset($_GET['action']) && $_GET['action'] === 'getMeineAusgeliehenenBuecher') {

    if (!isset($_SESSION['schueler_id'])) {
        echo json_encode(["error" => "Nicht angemeldet"]);
        exit;
    }
    $schueler_id = $_SESSION['schueler_id'];
    $search = isset($_GET['search']) ? trim($_GET['search']) : "";
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 10;
    $offset = ($page - 1) * $limit;

    $getMeineAusg = $ausleiheModel->getMeineAusgeliehenenBuecher($search, $limit, $offset, $schueler_id);
    echo json_encode($getMeineAusg);
    exit;
}
if (isset($_GET['action']) && $_GET['action'] === 'getDueAndUpcomingBooks') {
    $tageBisFaellig = isset($_GET['tage']) ? (int)$_GET['tage'] : 3;
    $schueler_id = $_SESSION['schueler_id']; 
    $search = isset($_GET['search']) ? trim($_GET['search']) : "";
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 10;
    $offset = ($page - 1) * $limit;
    $books = $ausleiheModel->getDueAndUpcomingBooks($search, $limit, $offset, $schueler_id, $tageBisFaellig);
    echo json_encode($books);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';
    $books = [];
    if (!empty($searchTerm)) {
        $books = $ausleiheModel->getBooks($searchTerm);
    } elseif (isset($_GET['action']) && $_GET['action'] === 'getBooks') {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $books = $ausleiheModel->getAllBooks($page, $limit);
    }
    
    echo json_encode($books);
    exit;
}

?>
