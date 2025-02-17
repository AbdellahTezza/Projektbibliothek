<?php
require_once "../controllers/BookController.php";

// Instanziiere den Controller
$controller = new BookController(Database::getConnection());





// API-Aufruf für das Abrufen der Bücher
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getBooks') {
    $controller->getBooks();  // Gibt die Bücher als JSON zurück
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'deleteBook') {
    if (isset($_GET['id'])) {
        $bookId = intval($_GET['id']);
        $result = $controller->deleteBook($bookId);
        // $controller->getBooks();  // Gibt die Bücher als JSON zurück
    } 
} elseif  ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getBook') {
    if (isset($_GET['id'])) {
        $bookId = intval($_GET['id']);
        $controller->getBook($bookId);
    } else {
        echo json_encode(['success' => false, 'message' => 'Buch-ID fehlt']);
    }
} 

// if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateBook') {
//     // Check if the book ID is present
//     if (isset($_GET['id'])) {
//         $bookId = intval($_GET['id']);

//         // Check if all the required POST data is available
//         if (isset($_POST['titel'], $_POST['autor'], $_POST['isbn'], $_POST['beschreibung'])) {
//             $titel = htmlspecialchars($_POST['titel']);
//             $autor = htmlspecialchars($_POST['autor']);
//             $isbn = htmlspecialchars($_POST['isbn']);
//             $beschreibung = htmlspecialchars($_POST['beschreibung']);
//             $bild = null; // Default value if no image is uploaded

//             // Handle image upload (if a new image is uploaded)
//             if (isset($_FILES['bild']) && $_FILES['bild']['error'] == 0) {
//                 $targetDir = "../../public/bilder/buecher/";
//                 $targetFile = $targetDir . basename($_FILES["bild"]["name"]);

//                 if (move_uploaded_file($_FILES["bild"]["tmp_name"], $targetFile)) {
//                     $bild = $targetFile;  // Update the image path
//                 } else {
//                     echo json_encode(["success" => false, "message" => "Fehler beim Hochladen des Bildes"]);
//                     exit;
//                 }
//             }

//             // Call the controller method to update the book
//             $result = $controller->updateBook($bookId, $titel, $autor, $isbn, $beschreibung, $bild);
//             echo json_encode($result); // Send the result as a response
//         } else {
//             echo json_encode(['success' => false, 'message' => 'Fehlende Daten']);
//         }
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Buch-ID fehlt']);
//     }
// }
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateBook') {
    if (isset($_GET['id'])) {
        $bookId = intval($_GET['id']);

        // Check if the necessary fields are set
        if (isset($_POST['titel'], $_POST['autor'], $_POST['isbn'], $_POST['beschreibung'])) {
            $titel = htmlspecialchars($_POST['titel']);
            $autor = htmlspecialchars($_POST['autor']);
            $isbn = htmlspecialchars($_POST['isbn']);
            $beschreibung = htmlspecialchars($_POST['beschreibung']);

            // Handle image upload (if a new image is uploaded)
            $bild = null;  // Default if no new image is uploaded
            if (isset($_FILES['bild']) && $_FILES['bild']['error'] == 0) {
                $targetDir = "../../public/bilder/buecher/";
                $targetFile = $targetDir . basename($_FILES["bild"]["name"]);

                if (move_uploaded_file($_FILES["bild"]["tmp_name"], $targetFile)) {
                    $bild = $targetFile;  // Set the new image path
                } else {
                    echo json_encode(["success" => false, "message" => "Fehler beim Hochladen des Bildes"]);
                    exit;
                }
            }

            // Call the controller method to update the book
            $result = $controller->updateBook($bookId, $titel, $autor, $isbn, $beschreibung, $bild);
            echo json_encode($result); // Send the result as a response
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehlende Daten']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Buch-ID fehlt']);
    }
}


// } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateBook') {
//     // Überprüfen, ob die ID vorhanden ist
//     if (isset($_GET['id'])) {
//         $bookId = intval($_GET['id']);

//         // JSON-Daten aus dem Request-Body abrufen
//         $inputData = json_decode(file_get_contents("php://input"), true);

//         if ($inputData && isset($inputData['titel'], $inputData['autor'], $inputData['isbn'])) {
//             $titel = htmlspecialchars($inputData['titel']);
//             $autor = htmlspecialchars($inputData['autor']);
//             $isbn = htmlspecialchars($inputData['isbn']);

//             $result = $controller->updateBook($bookId, $titel, $autor, $isbn);
//             // echo json_encode($result); // Antwort zurücksenden
//         } else {
//             echo json_encode(['success' => false, 'message' => 'Ungültige Daten']);
//         }
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Buch-ID fehlt']);
//     }
// } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addBook') {
//     $data = json_decode(file_get_contents("php://input"), true);
//     if (isset($data['titel'], $data['autor'], $data['isbn'])) {
//         $controller->addBook($data['titel'], $data['autor'], $data['isbn']);
//     } else {
//         echo json_encode(["success" => false, "message" => "Fehlende Daten"]);
//     }
// }





if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addBook') {
    // Check if necessary fields are set
    if (isset($_POST['titel'], $_POST['autor'], $_POST['isbn'], $_POST['beschreibung']) && isset($_FILES['bild'])) {
        $titel = htmlspecialchars($_POST['titel']);
        $autor = htmlspecialchars($_POST['autor']);
        $isbn = htmlspecialchars($_POST['isbn']);
        $beschreibung = htmlspecialchars($_POST['beschreibung']);
        
        // Handle image upload
        $bild = $_FILES['bild']['name'];
        $targetDir = "../../public/bilder/buecher/";
        $targetFile = $targetDir . basename($bild);

        // Move uploaded file to the target directory
        if (move_uploaded_file($_FILES['bild']['tmp_name'], $targetFile)) {
            // Successfully uploaded image
            $bild = $targetFile; // Store image path
        } else {
            echo json_encode(["success" => false, "message" => "Fehler beim Hochladen des Bildes"]);
            exit;
        }

        // Add book (with image path)
        $controller->addBook($titel, $autor, $isbn, $beschreibung, $bild);
    } else {
        echo json_encode(["success" => false, "message" => "Fehlende Daten"]);
    }
}


?>