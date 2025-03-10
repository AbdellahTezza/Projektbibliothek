<?php 
require_once "../controllers/AuthController.php";
require_once "../controllers/SchuelerController.php";

$authController = new AuthController(Database::getConnection());

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getSchueler') {

    if (!isset($_SESSION['schueler_id'])) {
        echo json_encode(["error" => "Nicht angemeldet"]);
        exit;
    }

    $search = isset($_GET['search']) ? trim($_GET['search']) : "";
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 10;
    $offset = ($page - 1) * $limit;
    $result = $authController->getSchueler($search, $limit, $offset);
    echo json_encode($result);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $bildPath = null; 
    if (isset($_FILES['bild']) && $_FILES['bild']['error'] == 0) {
        $uploadDir = "../../public/bilder/schuler/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $bildName = time() . "_" . basename($_FILES['bild']['name']);
        $targetFile = $uploadDir . $bildName;
    
        if (move_uploaded_file($_FILES['bild']['tmp_name'], $targetFile)) {
            $bildPath = $targetFile;
        }
    }

    if ($_POST['action'] === 'addSchueler') {
        $authController->register($_POST['vorname'], $_POST['nachname'], $_POST['email'], $_POST['password'],  'schueler', $bildPath);
    } 
    elseif ($_POST['action'] === 'updateSchueler') {
        $password = !empty($_POST['password']) ? $_POST['password'] : null;
        
        if ($bildPath === null && isset($_POST['current_bild'])) {
            $bildPath = $_POST['current_bild'];
        }
    
        $authController->updateSchueler($_POST['id'], $_POST['vorname'], $_POST['nachname'], $_POST['email'], $password, $bildPath);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'deleteSchueler') {
    $authController->deleteSchueler($_GET['id']);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getSchuelerById' && isset($_GET['id'])) {
    $authController->getSchuelerById($_GET['id']);
}elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getSchuelerById' && isset($_SESSION['schueler_id'])) { 
    $authController->getSchuelerById($_SESSION['schueler_id']); 
}

$SchuelerController = new SchuelerController(Database::getConnection()); 
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getAllBooks') {
    $SchuelerController->getAllBooks();
} 

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'borrowBook') {
    if (!isset($_POST['buch_id'])) {
        echo json_encode(["message" => "Fehler: Buch-ID fehlt!"]);
        exit;
    }
    
    $buch_id = $_POST['buch_id'];
    $result = $SchuelerController->borrowBook($buch_id);
    echo json_encode($result);
    
}

?>