<?php
class Book {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Alle Bücher abrufen
    public function getAllBooks() {
        $query = "SELECT * FROM buecher";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        return $result;
    } 


public function createBook($titel, $autor, $isbn, $beschreibung, $bild) {
    $query = "INSERT INTO buecher (titel, autor, isbn, beschreibung, bild) 
              VALUES (:titel, :autor, :isbn, :beschreibung, :bild)";
    
    $stmt = $this->db->prepare($query);
    
    $stmt->bindParam(':titel', $titel);
    $stmt->bindParam(':autor', $autor);
    $stmt->bindParam(':isbn', $isbn);
    $stmt->bindParam(':beschreibung', $beschreibung);
    $stmt->bindParam(':bild', $bild);  
    
    if ($stmt->execute()) {
        return ['success' => true, 'message' => 'Buch hinzugefügt'];
    }
    
    return ['success' => false, 'message' => 'Fehler beim Hinzufügen des Buches'];
}




public function updateBook($id, $titel, $autor, $isbn, $beschreibung, $bild) {

    if (empty($bild)) {
        $currentBild = $this->getCurrentImage($id); 
        $bild = $currentBild; 
    }

    $query = "UPDATE buecher SET titel = :titel, autor = :autor, isbn = :isbn, beschreibung = :beschreibung, bild = :bild WHERE id = :id";

    $stmt = $this->db->prepare($query);

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':titel', $titel);
    $stmt->bindParam(':autor', $autor);
    $stmt->bindParam(':isbn', $isbn);
    $stmt->bindParam(':beschreibung', $beschreibung);

    $stmt->bindParam(':bild', $bild);

    if ($stmt->execute()) {
        return ['success' => true, 'message' => 'Das Buch wurde erfolgreich aktualisiert'];
    }
    return ['success' => false, 'message' => 'Ein Fehler ist beim Aktualisieren des Buches aufgetreten'];

}

private function getCurrentImage($id) {
    $query = "SELECT bild FROM buecher WHERE id = :id";
    $stmt = $this->db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result['bild']; 
}

    public function deleteBook($id) {
        $query = "DELETE FROM buecher WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Buch gelöscht'];
        }
        return ['success' => false, 'message' => 'Fehler beim Löschen des Buches'];
    }

    public function getBookById($id) {
        $query = "SELECT * FROM buecher WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $book = $stmt->fetch(PDO::FETCH_ASSOC);

        return $book ?: null; 
    }
    public function getAvailableBooks($search = "", $limit = 10, $offset = 0) {
        $query = "SELECT 
                    b.id, 
                    b.titel, 
                    b.autor, 
                    b.beschreibung,
                    b.bild,
                    'Verfügbar' AS status_text 
                  FROM buecher b 
                  WHERE b.id NOT IN ( 
                      SELECT buch_id FROM ausleihen WHERE status != 'returned'
                  )";
        
        if (!empty($search)) {
            $query .= " AND (b.titel LIKE :search OR b.autor LIKE :search)";
        }
        
        $query .= " LIMIT :limit OFFSET :offset";
        
        $stmt = $this->db->prepare($query);
        
        if (!empty($search)) {
            $searchParam = "%" . $search . "%";
            $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }
        
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $countQuery = "SELECT COUNT(*) 
                       FROM buecher b 
                       WHERE b.id NOT IN ( 
                           SELECT buch_id FROM ausleihen WHERE status != 'returned'
                       )";
        
        if (!empty($search)) {
            $countQuery .= " AND (b.titel LIKE :search OR b.autor LIKE :search)";
        }
        
        $countStmt = $this->db->prepare($countQuery);
        
        if (!empty($search)) {
            $countStmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }
        
        $countStmt->execute();
        $totalBooks = $countStmt->fetchColumn();
        
        return [
            'books' => $books,
            'totalBooks' => $totalBooks
        ];
    }
    
}
?>




