<?php 

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Ausleihe.php';

class AusleiheController {
    private $ausleiheModel;

    public function __construct($db) {
        $this->db = Database::getConnection();
        $this->ausleiheModel = new Ausleihe($db);
    }

    public function getBooks($searchTerm = '') {
        return $this->ausleiheModel->getBooks($searchTerm);
    }
    public function getAllBooks($page = 1, $limit = 10) {

        $page = max(1, (int)$page);  
        $limit = max(1, (int)$limit); 

        try {
            return $this->ausleiheModel->fetchAllBooks($page, $limit);
        } catch (Exception $e) {
            return ['error' => 'Fehler beim Abrufen der Bücher: ' . $e->getMessage()];
        }
    }

    public function borrowBook($buchId, $schuelerId) {
        $result = $this->ausleiheModel->borrowBook($buchId, $schuelerId);
        echo json_encode($result);
    }

    public function returnBook($buchId, $schuelerId) {
        $result = $this->ausleiheModel->returnBook($buchId, $schuelerId);
        echo json_encode($result);
    }

    public function getCounts() {
        $counts = [
            'ausleihen' => $this->ausleiheModel->countRecords('ausleihen'),
            'buecher' => $this->ausleiheModel->countRecords('buecher'),
            'schueler' => $this->ausleiheModel->countRecords('schueler')
        ];
        echo json_encode($counts);
        exit;
    }
    
    public function getCountsschuler($schueler_id) {
        $counts = [
            'buecher_verfuegbar' => $this->ausleiheModel->schulercountRecords('buecher_verfuegbar'),
            'meine_ausleihen' => $this->ausleiheModel->schulercountRecords('meine_ausleihen', $schueler_id),
            'ueberfaellig_bald' => $this->ausleiheModel->schulercountRecords('ueberfaellig_bald')
        ];
    
        echo json_encode($counts);
        exit;
    }
    
    public function getMeineAusgeliehenenBuecher($search, $limit, $offset, $schueler_id) {
        $result = $this->ausleiheModel->getMeineAusgeliehenenBuecher($search, $limit, $offset, $schueler_id);
       return $result;
    }

    public function getDueAndUpcomingBooks($search, $limit, $offset, $schueler_id, $tageBisFaellig) {
        $UpcomingBooks = $this->ausleiheModel->getDueAndUpcomingBooks($search, $limit, $offset, $schueler_id, $tageBisFaellig);
       return $UpcomingBooks;
    }
    
}    

