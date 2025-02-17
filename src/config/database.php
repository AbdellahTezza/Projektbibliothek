<?php
// class Database {
    // private $host = "127.0.0.1:4306";
    // private $db_name = "schulbibliothek";
    // private $username = "root";
    // private $password = "";
    // public $db;

    // public function getConnection() {
        // $this->db = null;
        // try {
            // $this->db = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // } catch (PDOException $exception) {
            // echo "Datenbankverbindungsfehler: " . $exception->getMessage();
        // }
        // return $this->db;
    // }
// }
?>


<?php
class Database {
    private static $connection = null;

    // Diese Methode stellt eine Verbindung zur Datenbank her
    public static function getConnection() {
        if (self::$connection === null) {
            try {
                $host = '127.0.0.1:4306'; // Datenbank-Host (z.B. localhost)
                $db = 'schulbibliothek'; // Name der Datenbank
                $user = 'root'; // Datenbank-Nutzername
                $password = ''; // Datenbank-Passwort (Standard für localhost)
                
                // DSN (Data Source Name) für PDO
                $dsn = "mysql:host=$host;dbname=$db;charset=utf8";
                
                // PDO-Instanz erstellen und Verbindung herstellen
                self::$connection = new PDO($dsn, $user, $password);
                
                // Fehlerbehandlung aktivieren
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}



    