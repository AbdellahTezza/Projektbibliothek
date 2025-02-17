<?php
session_start();
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Book.php';
require_once __DIR__ . '/../models/Ausleihe.php';

class SchuelerController {
    private $db;
    private $bookModel;
    private $ausleiheModel;

    public function __construct($db) {
        $this->db = Database::getConnection();
        $this->bookModel = new Book($db);
        $this->ausleiheModel = new Ausleihe($db);

    }

    private function checkLogin() {
        if (!isset($_SESSION['schueler_id'])) {
            echo json_encode(["error" => "Nicht eingeloggt"]);
            exit;
        }
    }
    
    public function getAllBooks() {
        $this->checkLogin();
        $search = isset($_GET['search']) ? $_GET['search'] : "";
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = 10; 
        $offset = ($page - 1) * $limit;
    
        if (!$this->bookModel) {
            echo json_encode(["error" => "Buch-Model konnte nicht geladen werden"]);
            exit;
        }
    
        $result = $this->bookModel->getAvailableBooks($search, $limit, $offset);
        echo json_encode($result);
    }
    
    public function borrowBook($buch_id) {
        $this->checkLogin();
        $schueler_id = $_SESSION['schueler_id'];
        $result = $this->ausleiheModel->borrowBook($buch_id, $schueler_id);
        return $result;

    }

}