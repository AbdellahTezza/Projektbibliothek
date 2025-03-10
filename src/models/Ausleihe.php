<?php
class Ausleihe {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getBooks($searchTerm = '', $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
    
        $query = "SELECT SQL_CALC_FOUND_ROWS 
                         b.id AS buch_id, 
                         b.titel, 
                         b.autor, 
                         s.vorname, 
                         s.nachname, 
                         a.rueckgabedatum, 
                         a.status,
                         a.schueler_id,
                         CASE 
                             WHEN a.id IS NULL THEN 'Verfügbar'
                             WHEN a.rueckgabedatum < CURDATE() THEN CONCAT('Überfällig bei ', s.vorname, ' ', s.nachname)
                             ELSE CONCAT('Ausgeliehen von ', s.vorname, ' ', s.nachname)
                         END AS status_text,
                         CASE 
                             WHEN a.rueckgabedatum IS NOT NULL AND a.rueckgabedatum >= CURDATE() 
                                 THEN CONCAT('Verbleibende Anzahl Tage: ', DATEDIFF(a.rueckgabedatum, CURDATE()))
                             WHEN a.rueckgabedatum IS NOT NULL AND a.rueckgabedatum < CURDATE() 
                                 THEN CONCAT('Überfällig seit ', ABS(DATEDIFF(a.rueckgabedatum, CURDATE())), ' Tagen')
                             ELSE ' '
                         END AS tage_bis_rueckgabe 
                  FROM buecher b
                  LEFT JOIN ausleihen a ON b.id = a.buch_id AND a.status != 'returned'
                  LEFT JOIN schueler s ON a.schueler_id = s.id
                  WHERE (b.titel LIKE CONCAT('%', :searchTerm, '%') OR b.autor LIKE CONCAT('%', :searchTerm, '%'))
                  ORDER BY b.titel, a.rueckgabedatum
                  LIMIT :limit OFFSET :offset";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $totalQuery = "SELECT FOUND_ROWS() as total";
        $totalStmt = $this->db->query($totalQuery);
        $totalCount = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
        $totalPages = ceil($totalCount / $limit);
    
        return ['books' => $books, 'totalPages' => $totalPages];
    }
   
    public function fetchAllBooks($page = 1, $limit = 10) {
        $page = max(1, $page); 
        $limit = max(1, $limit); 
    
        $offset = ($page - 1) * $limit;
                if ($offset < 0) {
            $offset = 0;
        }
    
        $query = "SELECT SQL_CALC_FOUND_ROWS 
                             b.id AS buch_id, 
                             b.bild,
                             b.titel, 
                             b.autor, 

                             s.vorname, 
                             s.nachname, 
                             a.rueckgabedatum, 
                             a.status,
                             a.schueler_id,
                             CASE 
                                 WHEN a.id IS NULL THEN 'Verfügbar'
                                 WHEN a.rueckgabedatum < CURDATE() THEN CONCAT('Überfällig bei ', s.vorname, ' ', s.nachname)
                                 ELSE CONCAT('Ausgeliehen von ', s.vorname, ' ', s.nachname)
                             END AS status_text,
                             CASE 
                                 WHEN a.rueckgabedatum IS NOT NULL AND a.rueckgabedatum >= CURDATE() 
                                     THEN CONCAT('Verbleibende Anzahl Tage: ', DATEDIFF(a.rueckgabedatum, CURDATE()))
                                 WHEN a.rueckgabedatum IS NOT NULL AND a.rueckgabedatum < CURDATE() 
                                     THEN CONCAT('Überfällig seit ', ABS(DATEDIFF(a.rueckgabedatum, CURDATE())), ' Tagen')
                                 ELSE ' '
                             END AS tage_bis_rueckgabe 
                      FROM buecher b
                      LEFT JOIN ausleihen a ON b.id = a.buch_id AND a.status != 'returned'
                      LEFT JOIN schueler s ON a.schueler_id = s.id
                      ORDER BY b.titel, a.rueckgabedatum
                      LIMIT :limit OFFSET :offset";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $totalQuery = "SELECT FOUND_ROWS() as total";
        $totalStmt = $this->db->query($totalQuery);
        $totalCount = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
        $totalPages = ceil($totalCount / $limit);
        
        return ['books' => $books, 'totalPages' => $totalPages];
    }
    
    public function borrowBook($buchId, $schuelerId) {
        $query = "INSERT INTO ausleihen (buch_id, schueler_id, ausleihdatum, rueckgabedatum, status) 
                  VALUES (:buch_id, :schueler_id, NOW(), DATE_ADD(NOW(), INTERVAL 4 WEEK), 'borrowed')";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':buch_id', $buchId);
        $stmt->bindParam(':schueler_id', $schuelerId);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Buch erfolgreich ausgeliehen'];
        }
        return ['success' => false, 'message' => 'Fehler beim Ausleihen'];
    }

    public function returnBook($buchId, $schuelerId) {
        $query = "UPDATE ausleihen SET status = 'returned', rueckgabedatum = NOW() 
                  WHERE buch_id = :buch_id AND schueler_id = :schueler_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':buch_id', $buchId);
        $stmt->bindParam(':schueler_id', $schuelerId);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Buch erfolgreich zurückgegeben'];
        }
        return ['success' => false, 'message' => 'Fehler beim Zurückgeben'];
    }

    public function schulercountRecords($type, $schueler_id = null) {
        $queries = [
            'buecher_verfuegbar' => "
                SELECT COUNT(*) 
                FROM buecher b 
                LEFT JOIN ausleihen a ON b.id = a.buch_id AND a.status = 'borrowed'
                WHERE a.buch_id IS NULL
            ",
    
            'meine_ausleihen' => "
                SELECT COUNT(*) 
                FROM ausleihen 
                WHERE schueler_id = :schueler_id AND status = 'borrowed'
            ",
    
            'ueberfaellig_bald' => "
                SELECT COUNT(*) 
                FROM ausleihen 
                WHERE status = 'borrowed' 
                AND rueckgabedatum IS NOT NULL
                AND (DATEDIFF(rueckgabedatum, CURDATE()) < 0 OR DATEDIFF(rueckgabedatum, CURDATE()) BETWEEN 0 AND 5)
            "
        ];
    
        if (!isset($queries[$type])) {
            throw new InvalidArgumentException("Ungültiger Typ: " . htmlspecialchars($type));
        }
    
        $stmt = $this->db->prepare($queries[$type]);
    
        if ($type === 'meine_ausleihen') {
            if ($schueler_id === null) {
                throw new InvalidArgumentException("schueler_id darf nicht null sein für 'meine_ausleihen'");
            }
            $stmt->bindParam(':schueler_id', $schueler_id, PDO::PARAM_INT);
        }
    
        $stmt->execute();
        return $stmt->fetchColumn() ?? 0;
    }
    
    public function countRecords($table) {
        $allowedTables = ['ausleihen', 'buecher', 'schueler'];
        if (!in_array($table, $allowedTables)) {
            throw new InvalidArgumentException("Ungültige Tabelle: " . htmlspecialchars($table));
        }

        $query = "SELECT COUNT(*) FROM $table";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchColumn() ?? 0;
    }

    public function getMeineAusgeliehenenBuecher($search, $limit, $offset, $schueler_id) {
        $query = "SELECT a.id AS ausleihe_id,
                    a.buch_id, 
                    b.titel, 
                    b.autor,
                    b.bild, 
                    a.ausleihdatum, 
                    a.rueckgabedatum, 
                    DATEDIFF(a.rueckgabedatum, CURDATE()) AS tage_bis_rueckgabe,
                    CASE 
                        WHEN a.rueckgabedatum IS NOT NULL AND a.rueckgabedatum >= CURDATE() 
                            THEN CONCAT('Verbleibende Anzahl Tage: ', DATEDIFF(a.rueckgabedatum, CURDATE()))
                        WHEN a.rueckgabedatum IS NOT NULL AND DATEDIFF(a.rueckgabedatum, CURDATE()) BETWEEN 0 AND 5 
                            THEN CONCAT('Bald überfällig in ', DATEDIFF(a.rueckgabedatum, CURDATE()), ' Tagen')
                    END AS rueckgabe_status
            FROM ausleihen a 
            JOIN buecher b ON a.buch_id = b.id 
            WHERE a.schueler_id = :schueler_id  
            AND a.status = 'borrowed'
            AND DATEDIFF(a.rueckgabedatum, CURDATE()) >= 0";
                 

        if (!empty($search)) {
            $query .= " AND (b.titel LIKE :search OR b.autor LIKE :search)";
        }

        $query .= " ORDER BY a.ausleihdatum DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':schueler_id', $schueler_id, PDO::PARAM_INT);

        if (!empty($search)) {
            $searchParam = "%" . $search . "%"; 
            $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }

        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'books' => $books,
            'totalBooks' => count($books)
        ];
    }

    public function getDueAndUpcomingBooks($search, $limit, $offset, $schueler_id, $tageBisFaellig) {
        $query = "SELECT  
                    a.id AS ausleihe_id, 
                    a.buch_id, 
                    b.titel, 
                    b.autor, 
                    b.bild,
                    a.ausleihdatum, 
                    a.rueckgabedatum, 
                    DATEDIFF(a.rueckgabedatum, CURDATE()) AS tage_bis_rueckgabe,
                    CASE 
                        WHEN DATEDIFF(a.rueckgabedatum, CURDATE()) < 0 THEN 
                            CONCAT('Überfällig seit ', ABS(DATEDIFF(a.rueckgabedatum, CURDATE())), ' Tagen') 
                        WHEN DATEDIFF(a.rueckgabedatum, CURDATE()) BETWEEN 0 AND :tage THEN 
                            CONCAT('Bald überfällig in ', DATEDIFF(a.rueckgabedatum, CURDATE()), ' Tagen') 
                    END AS rueckgabe_status
                    FROM ausleihen a
                    JOIN buecher b ON a.buch_id = b.id
                    WHERE a.schueler_id = :schueler_id
                    AND a.status = 'borrowed'
                    AND (
                    DATEDIFF(a.rueckgabedatum, CURDATE()) < 0 
                    OR DATEDIFF(a.rueckgabedatum, CURDATE()) BETWEEN 0 AND :tage
                    )";

        if (!empty($search)) {
            $query .= " AND (b.titel LIKE :search OR b.autor LIKE :search)";
        }
    
        $query .= " HAVING rueckgabe_status IS NOT NULL";
        $query .= " ORDER BY a.ausleihdatum DESC LIMIT :limit OFFSET :offset";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':schueler_id', $schueler_id, PDO::PARAM_INT);
        $stmt->bindParam(':tage', $tageBisFaellig, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    
        if (!empty($search)) {
            $searchParam = "%" . $search . "%";
            $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }
    
        $stmt->execute();
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        return [
            'books' => $books,
            'totalBooks' => count($books)
        ];
    }
    
}

?>