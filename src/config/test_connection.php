<?php
// Die Database-Klasse einbinden
require_once 'Database.php';

// Eine Instanz der Database-Klasse erstellen
$database = new Database();

// Verbindung herstellen
$conn = $database->getConnection();

// Prüfen, ob die Verbindung erfolgreich war
if ($conn) {
    echo "Verbindung zur Datenbank war erfolgreich!";
} else {
    echo "Fehler bei der Verbindung zur Datenbank.";
}

$sql = "INSERT INTO admins (vorname, nachname, email, passwort_hash) VALUES (:vorname, :nachname, :email, :passwort)";



// Das Statement vorbereiten
$stmt = $conn->prepare($sql);

// Daten definieren
$vorname = "Max";
$nachname = "Müller";
$email = "max.mueller@example.com";
$passwort = password_hash("a123", PASSWORD_DEFAULT); // Passwort sicher hashen

// Platzhalter mit den echten Werten ersetzen
$stmt->bindParam(':vorname', $vorname);
$stmt->bindParam(':nachname', $nachname);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':passwort', $passwort);

// SQL-Abfrage ausführen
if ($stmt->execute()) {
    echo "Neuer Schüler wurde erfolgreich eingefügt!";
} else {
    echo "Fehler beim Einfügen des Schülers.";
}
?>
