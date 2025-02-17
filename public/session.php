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

?>