<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Book.php';
require_once __DIR__ . '/../models/Ausleihe.php';

class BookController {
    private $db;
    private $bookModel;
    private $ausleiheModel;

    public function __construct($db) {
        $this->db = Database::getConnection();
        $this->bookModel = new Book($db);
        $this->ausleiheModel = new Ausleihe($db);
    }

    public function getBooks() {
        $books = $this->bookModel->getAllBooks();
        echo json_encode($books); 
    }

    public function addBook($titel, $autor, $isbn, $beschreibung, $bild) {
        $result = $this->bookModel->createBook($titel, $autor, $isbn, $beschreibung, $bild);
        echo json_encode($result);
    }

    public function updateBook($id, $titel, $autor, $isbn, $beschreibung, $bild) {
        $result = $this->bookModel->updateBook($id, $titel, $autor, $isbn, $beschreibung, $bild);
        return $result;

    }
    
    public function deleteBook($id) {
        $result = $this->bookModel->deleteBook($id);
        echo json_encode($result);
        exit; 
    }
    
    public function getBook($id) {
        $book = $this->bookModel->getBookById($id);
        if ($book) {
            echo json_encode($book);
        } else {
            echo json_encode(['success' => false, 'message' => 'Buch nicht gefunden']);
        }
    }


}
?>