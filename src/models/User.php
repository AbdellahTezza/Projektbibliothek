<?php

class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createUser($vorname, $nachname, $email, $password, $userType, $bild = null) {
        $table = ($userType === 'admin') ? "admins" : "schueler";
    
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
        $query = "INSERT INTO schueler (vorname, nachname, email, passwort_hash, bild) VALUES (:vorname, :nachname, :email, :passwort, :bild)";
        $stmt = $this->db->prepare($query);
        
        $stmt->bindParam(':vorname', $vorname);
        $stmt->bindParam(':nachname', $nachname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':passwort', $hashedPassword);
        $stmt->bindParam(':bild', $bild); 
        if ($stmt->execute()) {
            return ["success" => true, "redirect" => "../public/dashboard.html", "message" => "Registrierung erfolgreich!"];

        } else {
            return ["success" => false, "message" => "Fehler bei der Registrierung!"];

        }
    }

    
    
    public function getAllSchueler($search = '', $limit = 10, $offset = 0) {
        $query = "SELECT id, vorname, nachname, email FROM schueler WHERE 1";
    
        if (!empty($search)) {
            $query .= " AND (vorname LIKE :search OR nachname LIKE :search OR email LIKE :search)";
        }
        $query .= " ORDER BY nachname LIMIT :limit OFFSET :offset";
    
        $stmt = $this->db->prepare($query);
        if (!empty($search)) {
            $searchParam = "%" . $search . "%";
            $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $countQuery = "SELECT COUNT(*) as total FROM schueler WHERE 1";
        if (!empty($search)) {
            $countQuery .= " AND (vorname LIKE :search OR nachname LIKE :search OR email LIKE :search)";
        }
    
        $countStmt = $this->db->prepare($countQuery);
        if (!empty($search)) {
            $countStmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
        }
        $countStmt->execute();
        $totalStudents = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
        return [
            'students' => $students,
            'totalStudents' => $totalStudents
        ];
    }
    
    public function getUserByEmail($email, $userType) {
        $table = ($userType === 'admin') ? "admins" : "schueler";
		$stmt = $this->db->prepare("SELECT id FROM $table WHERE email = ?");
		$stmt->execute([$email]);
		
		if ($stmt->fetch()) {
			return json_encode(["success" => false, "message" => "Diese E-Mail-Adresse ist bereits registriert!"]);
		}
		
	}

    public function deleteSchueler($id) {
        $query = "DELETE FROM schueler WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Schueler gelöscht'];
        }
        return ['success' => false, 'message' => 'Fehler beim Löschen des Schueler'];
    }
    public function updateSchueler($id, $vorname, $nachname, $email, $password = null, $bild = null) {
        if ($bild === null) {
            $bild = $this->getCurrentBild($id); 
        }
            if ($password) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $query = "UPDATE schueler SET vorname = :vorname, nachname = :nachname, email = :email, passwort_hash = :passwort, bild = :bild WHERE id = :id";
        } else {
            $query = "UPDATE schueler SET vorname = :vorname, nachname = :nachname, email = :email, bild = :bild WHERE id = :id";
        }
            
        $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':vorname', $vorname);
        $stmt->bindParam(':nachname', $nachname);
        $stmt->bindParam(':email', $email);
            if ($password) {
            $stmt->bindParam(':passwort', $hashedPassword);
        }
    
        $stmt->bindParam(':bild', $bild);
    
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Schueler erfolgreich aktualisiert'];
        }
    
        return ['success' => false, 'message' => 'Fehler beim Aktualisieren des Schuelers'];
    }
    
    private function getCurrentBild($id) {
        $query = "SELECT bild FROM schueler WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['bild']; 
    }
    
    public function getSchuelerById($id) {
        $stmt = $this->db->prepare("SELECT * FROM schueler WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    public function getUserdata($roled, $schueler_id) {
        if (!in_array($roled, ['admins', 'schueler'])) {
            return null;
        }

        $stmt = $this->db->prepare("SELECT * FROM $roled WHERE id = ?");
        $stmt->execute([$schueler_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function checkUser($email) {
        $sql = "SELECT id,  vorname, nachname, passwort_hash, 'admin' AS role
                FROM admins WHERE email = :email
                UNION
                SELECT id, vorname, nachname, passwort_hash, 'schuler' AS role
                FROM schueler WHERE email = :email";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);

    }
}


?>