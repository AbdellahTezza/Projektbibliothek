<?php
session_start();  // Startet die Session, falls sie noch nicht gestartet wurde

echo "<pre>";
print_r($_SESSION);
echo "</pre>";




// // Connexion à la base de données (exemple avec PDO)
// $pdo = new PDO("mysql:host=localhost;dbname=ma_base", "root", "");

// // Mot de passe à hacher
// $password = "monMotDePasse123";

// // Générer un hash sécurisé avec `password_hash()`
// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// // Insérer l'utilisateur avec le mot de passe haché
// $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
// $stmt = $pdo->prepare($query);
// $stmt->execute([
//     ':username' => 'monUtilisateur',
//     ':password' => $hashedPassword
// ]);

// echo "Utilisateur enregistré avec succès !";

// $host = '127.0.0.1:4306'; // Datenbank-Host (z.B. localhost)
// $db = 'schulbibliothek'; // Name der Datenbank
// $user = 'root'; // Datenbank-Nutzername
// $password = ''; // Datenbank-Passwort (Standard für localhost)
$pdo = new PDO("mysql:host=127.0.0.1:4306;dbname=schulbibliothek", "root", "");

// Holen des gespeicherten Passwort-Hashes
$query = "SELECT passwort_hash FROM schueler WHERE vorname = :vorname";
$stmt = $pdo->prepare($query);
$stmt->execute([':vorname' => 't']);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "Gespeicherter Passwort-Hash: " . $user['passwort_hash'];
} else {
    echo "Benutzer nicht gefunden!";
}



$hash = $user['passwort_hash']; 
$eingabePasswort = "t"; // Teste mit dem ursprünglichen Passwort

if (password_verify($eingabePasswort, $hash)) {
    echo "✅ Passwort ist korrekt!";
} else {
    echo "❌ Falsches Passwort!";
}

?>