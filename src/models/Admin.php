<?php
class Admin {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAdminById($id) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>