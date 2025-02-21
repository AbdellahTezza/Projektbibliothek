<?php
class Database {
    private static $connection = null;

    public static function getConnection() {
        if (self::$connection === null) {
            try {
                $host = '127.0.0.1:4306'; 
                $db = 'schulbibliothek'; 
                $user = 'root'; 
                $password = ''; 
                
                $dsn = "mysql:host=$host;dbname=$db;charset=utf8";
                
                self::$connection = new PDO($dsn, $user, $password);
                
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}



    