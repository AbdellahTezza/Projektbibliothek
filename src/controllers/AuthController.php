<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';


class AuthController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function register($vorname, $nachname, $email, $password, $userType, $bildPath = null) {
        if (empty($vorname) || empty($nachname) || empty($email) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Bitte fülle alle Felder aus!"]);
            return;
        }
    
        $user = new User($this->db);
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $loggedInUser = $user->getUserByEmail($email, $userType);
    
        if ($loggedInUser) {
            echo json_encode(["success" => false, "message" => "Diese E-Mail-Adresse ist bereits registriert!"]);
            return;
        }
        $result = $user->createUser($vorname, $nachname, $email, $hashedPassword, $userType, $bildPath);

        header('Content-Type: application/json'); 
        echo json_encode($result);
        exit();
    }
    
    public function login($email, $password) {
        $luserl = new User($this->db);
        $user = $luserl->checkUser($email);
    
        if ($user) {
            if (password_verify($password, $user['passwort_hash'])) {
                session_start();
                $_SESSION["schueler_id"] = $user['id'];
                $_SESSION["vorname"] = $user['vorname'];
                $_SESSION["nachname"] = $user['nachname'];
                $_SESSION["role"] = $user['role']; 
                $redirectPage = ($user['role'] === 'admin') ? '../public/dashboard_admin.html' : '../public/dashboard.html';
                if ($user['role'] === 'admin') {
                    return json_encode(["success" => true, "message" => "Login erfolgreich", "redirect" => $redirectPage]);
                } elseif ($user['role'] === 'schuler') {
                    return json_encode(["success" => true, "message" => "Login erfolgreich", "redirect" => $redirectPage]);
                }
                exit;
            } else {
                return json_encode(["success" => false, "message" => "Falsches Passwort."]);
            }
        } else {
            // return json_encode(["success" => false, "message" => "Benutzer nicht gefunden.", "redirect" => '../public/register.html']);
        }
    }
    

    public function getSchueler($search = '', $limit = 10, $offset = 0) {
        $user = new User($this->db);
        $result = $user->getAllSchueler($search, $limit, $offset);
        return $result;
    }


public function updateSchueler($id, $vorname, $nachname, $email, $password = null, $bildPath = null) {
    $user = new User($this->db);
    $result = $user->updateSchueler($id, $vorname, $nachname, $email, $password, $bildPath);
    echo json_encode($result);
}

public function deleteSchueler($id) {
        $user = new User($this->db);
        $result = $user->deleteSchueler($id);
        echo json_encode($result);
}

public function getSchuelerById($id) {
        $user = new User($this->db);
        $schueler = $user->getSchuelerById($id);

        if ($schueler) {
            echo json_encode($schueler);
        } else {
            echo json_encode(["error" => "Schüler nicht gefunden"]);
        }
    }
    public function getUserdata() {
        session_start();
    
        if (!isset($_SESSION['role']) || !isset($_SESSION['schueler_id'])) {
            echo json_encode(["error" => "Nicht angemeldet"]);
            return;
        }
    
        $user = new User($this->db);
        $roled = ($_SESSION['role'] === 'admin') ? 'admins' : 'schueler';
        $schueler_id = $_SESSION['schueler_id']; 
    
        $result = $user->getUserdata($roled, $schueler_id);
        return $result;
    
    }

    public function updateUserdata() {
        session_start();
    
        if (!isset($_SESSION['role']) || !isset($_SESSION['schueler_id'])) {
            echo json_encode(["error" => "Nicht angemeldet"]);
            return;
        }

        $user = new User($this->db);
        $schueler_id = $_SESSION['schueler_id']; 

        $password = !empty($_POST['password']) ? password_hash($_POST['password'], PASSWORD_BCRYPT) : null;

        if (isset($_FILES['bild']) && $_FILES['bild']['error'] === 0) {
            $role = $_SESSION['role']; 
            $uploadDir = '../../public/bilder/' . $role . '/';
            $bildPath = $uploadDir . basename($_FILES['bild']['name']);
            move_uploaded_file($_FILES['bild']['tmp_name'], $bildPath);
        } else {
            $bildPath = $_POST['current_bild'] ?? null;
        }

        $result = $user->updateSchueler($_POST['id'], $_POST['vorname'], $_POST['nachname'], $_POST['email'], $password, $bildPath);
        return $result;
    }
    
}










