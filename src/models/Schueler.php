<?php
class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createUser($name, $email, $password, $userType) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $table = ($userType === 'admin') ? "admins" : "schueler";

        $stmt = $this->db->prepare("INSERT INTO $table (name, email, passwort_hash) VALUES (?, ?, ?)");
        return $stmt->execute([$name, $email, $hashedPassword]) ? "Erfolgreich registriert!" : "Fehler bei der Registrierung!";
    }

    public function authenticate($email, $password, $userType) {
        $table = ($userType === 'admin') ? "admins" : "schueler";
        $stmt = $this->db->prepare("SELECT id, passwort_hash FROM $table WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['passwort_hash'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $userType;
            return "success";
        } else {
            return "Falsche E-Mail oder Passwort!";
        }
    }

    public function getAllUsers() {
        $stmt = $this->db->query("SELECT id, name, email FROM schueler UNION SELECT id, name, email FROM admins");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>
