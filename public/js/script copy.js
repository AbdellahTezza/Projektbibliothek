document.addEventListener("DOMContentLoaded", () => {
    // Code Login 
    let loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            // let userType = document.getElementById("userType").value;
            
            let response = await fetch("../src/views/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            
    
                body: `email=${email}&password=${password}`
            });
    
            let result = await response.json();		
            // console.log("Server Response:", result.success); 
                
            if (result.success) {
            
                // alert(result.message);
                window.location.href = result.redirect;
            } else {
                document.getElementById("errorMessage").textContent = result.message;
                if( result.message === 'Benutzer nicht gefunden.' ){
                    window.location.href = result.redirect; 
                }
            }
        });
    }

    // Registerm From
    let registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            let vorname = document.getElementById("vorname").value;
            let nachname = document.getElementById("nachname").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            let userType = document.getElementById("userType").value;
            
            let response = await fetch("../src/views/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `vorname=${vorname}&nachname=${nachname}&email=${email}&password=${password}&userType=${userType}`
            });
    
                let result = await response.json();
    
            if (result.success) {
                // alert(result.message);
                // document.getElementById("registerMessage").textContent = result.message;
                showAlert(result.message, "success");
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 2000); // 2 Sekunden warten vor der Weiterleitung
            } else {
                //document.getElementById("registerMessage").textContent = result.message;
                showAlert(result.message, "error");
                alert(result.message); // Fehler anzeigen
            }
        });
    }


});

if (window.location.href.includes("dashboard.html")) {
document.addEventListener("DOMContentLoaded", function() {
    fetch('../src/views/ausleihe.php?action=getCountsschuler')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loan-count').textContent = data.meine_ausleihen;
            document.getElementById('book-count').textContent = data.buecher_verfuegbar;
            document.getElementById('student-count').textContent = data.ueberfaellig_bald;
        })
        .catch(error => console.error("Fehler beim Laden der Statistiken:", error));
});      
}

if (window.location.href.includes("dashboard_admin.html")) {
    document.addEventListener("DOMContentLoaded", function() {
        fetch('../src/views/ausleihe.php?action=getCounts')
            .then(response => response.json())
            .then(data => {
                document.getElementById('loan-count').textContent = data.ausleihen;
                document.getElementById('book-count').textContent = data.buecher;
                document.getElementById('student-count').textContent = data.schueler;
            })
            .catch(error => console.error("Fehler beim Laden der Statistiken:", error));
    });      
}
    

// Alert Show
function showAlert(message, type) {
    let alertBox = document.getElementById("alertBox");

    // Entferne vorherige Klassen
    alertBox.className = "alert"; 

    // Füge die richtige Klasse hinzu
    if (type === "error") {
        alertBox.classList.add("alert-error");
    } else if (type === "success") {
        alertBox.classList.add("alert-success");
    } else if (type === "info") {
        alertBox.classList.add("alert-info");
    } else if (type === "warning") {
        alertBox.classList.add("alert-warning");
    }

    alertBox.textContent = message; // Nachricht setzen
    alertBox.classList.add("show-alert"); // Einblende-Animation

    // Automatisches Ausblenden nach 3 Sekunden
    setTimeout(() => {
        alertBox.classList.remove("show-alert");
    }, 3000);
}


// Alert Show
function mainAlert(message, type) {
    let alertBox = document.getElementById("alertBoxRepeat");
    let alertBoxemail = document.getElementById("alertBoxemail");

    // Entferne vorherige Klassen
    alertBox.className = "alert"; 
    alertBoxemail.className = "alert"; 

    // Füge die richtige Klasse hinzu
    if (type === "error") {
        alertBox.classList.add("alert-error");
        alertBoxemail.classList.add("alert-error");

    } else if (type === "success") {
        alertBox.classList.add("alert-success");
        alertBoxemail.classList.add("alert-success");
    } else if (type === "info") {
        alertBox.classList.add("alert-info");
        alertBoxemail.classList.add("alert-info");
    } else if (type === "warning") {
        alertBox.classList.add("alert-warning");
        alertBoxemail.classList.add("alert-warning");
    }

    alertBox.textContent = message; // Nachricht setzen
    alertBox.classList.add("show-alert"); // Einblende-Animation

    // Automatisches Ausblenden nach 3 Sekunden
    setTimeout(() => {
        alertBox.classList.remove("show-alert");
    }, 3000);
}




// Funktion zum Laden der Bücher und zur Anzeige der richtigen Seite
if (window.location.href.includes("books.html")) {
console.log("Books ");
const rowsPerPage = 5; // Anzahl der Zeilen pro Seite
let currentPage = 1;
let books = []; // Hier werden die Bücher gespeichert



function loadBooks() {
    fetch("../src/views/Books.php?action=getBooks")
        .then(response => response.json())
        .then(data => {
            console.log(data); // Überprüfe, ob die Daten korrekt zurückgegeben werden
            books = data;
            console.log("books",books);
            displayPage(currentPage);
            setupPagination();
        })
        .catch(error => console.error("Fehler beim Laden der Bücher:", error));
}

function displayPage(page) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const booksToShow = books.slice(startIndex, endIndex);

    booksToShow.forEach(book => {
        const row = document.createElement("tr");
        row.id = `book_${book.id}`;
        row.innerHTML = `
            <td>${book.titel}</td>
            <td>${book.autor}</td>
            <td>${book.isbn}</td>
            <td>
            <button class="edit" onclick="openModal(${book.id})"> ✏️ </button>

                <button class="delete" onclick="deleteBook(${book.id})"> 🗑️ </button>
            </td>
            
        `;
        tableBody.appendChild(row);
    });
}

// Funktion zur Anzeige der aktuellen Seite
// function displayPage(page) {
//     const tableBody = document.getElementById("table-body");
//     tableBody.innerHTML = "";

//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const booksToShow = books.slice(startIndex, endIndex);

//     booksToShow.forEach(book => {
//         const row = document.createElement("tr");
//         row.id = `book_${book.id}`;
//         row.innerHTML = `
//             <td>${book.titel}</td>
//             <td>${book.autor}</td>
//             <td>${book.isbn}</td>
//             // <td class="status-cell">
//             //     <span class="status ${book.status.toLowerCase()}">${book.status}</span>
//             // </td>
//             <td>
//             <button class="edit" onclick="openModal(${book.id})"> ✏️ </button>

//                 <button class="delete" onclick="deleteBook(${book.id})"> 🗑️ </button>
//             </td>
            
//         `;
//         tableBody.appendChild(row);
//     });
// }
// Funktion zur Paginierung
function setupPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(books.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.classList.add("pagination-btn");
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
            currentPage = i;
            displayPage(currentPage);
            setupPagination();
            loadBooks(); // Buchliste aktualisieren
        });
        pagination.appendChild(button);
    }
}


// Funktion zum Öffnen des Modals (Bearbeiten oder Hinzufügen)

function openModal(bookId) {

    console.log('Buch-ID:',  books); // Überprüfe den Inhalt des books-Arrays
    console.log('Buch-ID:', bookId);  // Überprüfe, ob die ID korrekt übergeben wird
    const book = books.find(b => b.id === String(bookId));  // Um den Stringvergleich zu erzwingen
    console.log('Gefundenes Buch:', book);
    const modal = document.getElementById("bookModal");
    const modalTitle = document.getElementById("modal-title");
    
    if (book) {
        // Buch bearbeiten
        modalTitle.textContent = "Buch bearbeiten";
        document.getElementById("bookId").value = book.id;
        document.getElementById("title").value = book.titel;
        document.getElementById("author").value = book.autor;
        document.getElementById("isbn").value = book.isbn;
    } else {
        // Neues Buch hinzufügen
        modalTitle.textContent = "Buch hinzufügen";
        document.getElementById("bookForm").reset(); // Formular zurücksetzen
    }

    modal.style.display = "flex"; // Modal anzeigen
}



// Modal schließen
function closeModal() {
    document.getElementById("bookModal").style.display = "none";
}

// Close-Button für das Modal
const closeModalBtn = document.querySelector('.close');
closeModalBtn.onclick = function() {
    closeModal(); // Modal schließen
};

// Schließen durch Klick außerhalb des Modals
window.onclick = function(event) {
    const modal = document.getElementById("bookModal");
    if (event.target === modal) {
        closeModal(); // Modal schließen
    }
};

// Formular-Verarbeitung (Speichern von Buch)
document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const bookId = document.getElementById("bookId").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    const data = { titel: title, autor: author, isbn: isbn };
    alert(bookId);
    if (bookId) {
        // Buch bearbeiten
        fetch(`../src/views/Books.php?action=updateBook&id=${bookId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // alert(result.message);
            showAlert(result.message, "success");
            books = result; // Hier wird das books-Array befüllt

            closeModal(); // Modal schließen
            loadBooks(); // Buchliste aktualisieren
        })
        .catch(error => console.error("Fehler beim Bearbeiten des Buches:", error));
    } else {
        // Neues Buch hinzufügen
        fetch("../src/views/Books.php?action=addBook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // alert(result.message);
            showAlert(result.message, "success");
            closeModal(); // Modal schließen
            loadBooks(); // Buchliste aktualisieren
        })
        .catch(error => console.error("Fehler beim Hinzufügen des Buches:", error));
    }
});

// Funktion zum Löschen eines Buches
function deleteBook(bookId) {
    if (confirm('Buch wirklich löschen?')) {
        fetch(`../src/views/Books.php?action=deleteBook&id=${bookId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data); // Debugging

            if (data.success) {
                showAlert(data.message, "success");
                // Animiertes Entfernen der Zeile
                let row = document.getElementById(`book_${bookId}`);
                row.style.transition = "opacity 0.5s";
                row.style.opacity = "0";
                setupPagination();
                setTimeout(() => {
                    row.remove();
                }, 500); // Wartezeit für die Animation
            } else {
                alert('Fehler beim Löschen des Buches: ' + data.message);
            }
        })
        .catch(error => console.error('Fehler beim Löschen des Buches:', error));
    }
}

// Initiales Laden der Bücher
document.addEventListener('DOMContentLoaded', loadBooks);


}



// page bucher 
if(window.location.href.includes("bucher.html")){
    document.addEventListener("DOMContentLoaded", function() {
        fetchBooks();
    });
    
    const booksPerPage = 10;  
    let currentPage = 1;  
    
    function fetchBooks(search = "", page = 1) {
        fetch(`../src/views/schueler.php?action=getAllBooks&search=${encodeURIComponent(search)}&page=${page}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Fehler beim Abrufen der Bücher!");
                }
                return res.json();
            })
            .then(data => {
                console.log(data.totalBooks, "data");  // Überprüfen, ob es ein Array ist
                if (data.books.length === 0) {
                    console.log("Keine Bücher gefunden!");
                    const bookListElement = document.getElementById("book-list");
                    if (bookListElement) {
                        bookListElement.innerHTML = '<tr><td colspan="4">Keine Bücher gefunden</td></tr>';
                    }
                    return;  // Frühzeitig abbrechen, wenn keine Bücher gefunden wurden
                }
    
                // Bücher rendern
                let content = data.books.map(book => ` 
                    <tr>
                        <td>${book.titel}</td>
                        <td>${book.autor}</td>
                        <td><span class="verfugbar">${book.status_text}</span></td>
                        <td>${book.status_text === "Verfügbar" 
                            ? `<button class="borrowBook" onclick="borrowBook(${book.id})"> Ausleihen</button>` 
                            : `-`}</td>
                    </tr>`).join("");
                document.getElementById("book-list").innerHTML = content;
    
                // Paginierung mit Gesamtzahl der Bücher aktualisieren
                updatePagination(data.totalBooks);
            })
            .catch(error => {
                console.error("Fehler beim Laden der Bücher:", error);
                const bookListElement = document.getElementById("book-list");
                if (bookListElement) {
                    bookListElement.innerHTML = '<tr><td colspan="4">Fehler beim Laden der Daten</td></tr>';
                }
            });
    }
    
    function updatePagination(totalBooks) {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = ""; // Vorhandene Paginierungsbuttons löschen
    
        // Gesamtzahl der Seiten berechnen
        const totalPages = Math.ceil(totalBooks / booksPerPage);
    
        // Seitenzahl-Buttons erstellen (1, 2, 3, 4, 5, ...)
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.innerText = i;
            button.classList.add("pagination-btn");
    
            // Den aktuellen Seiten-Button als aktiv markieren
            if (i === currentPage) button.classList.add("active");
    
            // Event Listener für den Klick auf die Seitenzahl
            button.addEventListener("click", () => {
                currentPage = i;
                fetchBooks("", currentPage); // Bücher für die gewählte Seite laden
            });
    
            pagination.appendChild(button);
        }
    }
    
    // Initiales Laden der Bücher
    fetchBooks();
    
    // Suchfeld-Event
    document.getElementById("searchInput").addEventListener("input", function() {
        fetchBooks(this.value);
    });
    
    function borrowBook(buch_id) {
        fetch('../src/views/schueler.php?action=borrowBook', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // WICHTIG für POST-Daten
            },
            body: new URLSearchParams({
                buch_id: buch_id
            })
        })
        .then(response => response.json())  // Antwort als JSON parsen
        .then(data => {
            // alert(data.message);  // Zeigt die Antwortnachricht an (z.B. Erfolg oder Fehler)
            if (data.message === "Das Buch wurde erfolgreich ausgeliehen.") {
                showAlert(data.message, "success");
                fetchBooks();  // Die Bücherliste nach dem Ausleihen erneut laden
            }
        })
        .catch(error => {
            console.error("Fehler:", error);
            alert("Es gab einen Fehler beim Ausleihen des Buches.");
        });
    }
    
}
// page Schuler

if (window.location.href.includes("schuler.html")) {
console.log("Vous êtes sur schuler.html !");
document.addEventListener("DOMContentLoaded", function () {
    loadSchueler();
});

function loadSchueler() {
    fetch("../src/views/schueler.php?action=getSchueler")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = "";

            data.forEach(schueler => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${schueler.id}</td>
                    <td>${schueler.vorname}</td>
                    <td>${schueler.nachname}</td>
                    <td>${schueler.email}</td>
                    <td>
                        <button class="edit" onclick="editSchueler(${schueler.id})">✏️ </button>
                        <button class="delete" onclick="deleteSchueler(${schueler.id})">🗑️ </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Fehler beim Laden der Schüler:", error));
}

function deleteSchueler(id) {
    // alert(id);
    if (confirm("Möchtest du diesen Schüler wirklich löschen?")) {
        fetch(`../src/views/schueler.php?action=deleteSchueler&id=${id}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            showAlert(data.message, "success");
            loadSchueler();
        })
        .catch(error => console.error("Fehler beim Löschen:", error));
    }
}


function openModal(id = null) {
    document.getElementById("schuelerModal").style.display = "flex";
    const passwordF = document.querySelector(".passwordF");
    passwordF.textContent = "Passwort :";
    if (id !== null) {
        passwordF.textContent = "Neues Passwort :";
        fetch(`../src/views/schueler.php?action=getSchuelerById&id=${id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("modal-title").textContent = "Schüler bearbeiten";
                document.getElementById("schuelerId").value = data.id;
                document.getElementById("vorname").value = data.vorname;
                document.getElementById("nachname").value = data.nachname;
                document.getElementById("email").value = data.email;
                document.getElementById("password").value = ""; // Passwort bleibt leer
                document.getElementById("current_bild").value = data.bild; // Passwort bleibt leer
            });
    } else {
        // Passwortfeld anzeigen, wenn ein neuer Schüler hinzugefügt wird
        // passwordField.style.display = "block";
        
        passwordF.textContent = "Passwort :";
        document.getElementById("modal-title").textContent = "Schüler hinzufügen";
        document.getElementById("schuelerId").value = "";
        document.getElementById("schuelerForm").reset();
    }
}


function closeModal() {
    document.getElementById("schuelerModal").style.display = "none";
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("schuelerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("schuelerId").value;
        const vorname = document.getElementById("vorname").value;
        const nachname = document.getElementById("nachname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value.trim(); // Entferne Leerzeichen;
        const bild = document.getElementById("bild").files[0];
        const currentBild = document.getElementById("current_bild")?.value;

        const formData = new FormData();
        formData.append("vorname", vorname);
        formData.append("nachname", nachname);
        formData.append("email", email);
        if (password) { 
            formData.append("password", password); 
        }
        if (bild) {
            formData.append("bild", bild);
        }


        if (!bild && currentBild) {
            formData.append("current_bild", currentBild);
        }
        if (id) {
            formData.append("id", id);
            formData.append("action", "updateSchueler");
        } else {
            formData.append("action", "addSchueler");
        }

        try {
            const response = await fetch("../src/views/schueler.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success === true ) {
                showAlert(result.message, "success");
                closeModal();
                loadSchueler();
            } else {
                // document.querySelector("#alertBoxRepeat").style.display = "block"; 
                mainAlert(result.message, "error");
            }
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            // showAlert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.", "error");
        }
    });
});

function editSchueler(id) {
    openModal(id);
}



}

// page meine_ausleihen
if (window.location.href.includes("meine_ausleihen.html")) {
function fetchMeineAusgeliehenenBuecher(search = "", page = 1) {
    const searchTerm = document.getElementById("searchInput").value.trim();

    let url = `../src/views/ausleihe.php?action=getMeineAusgeliehenenBuecher&page=${page}`;
    
    if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    fetch(url, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Serverantwort war nicht OK');
        }
        return response.json();
    })
    .then(data => {
        const ausleihenList = document.getElementById("ausleihen-list");

        if (!data || data.books.length === 0) {
            ausleihenList.innerHTML = "<tr><td colspan='5'>Keine ausgeliehenen Bücher gefunden</td></tr>";
            return;
        }

        let tableContent = '';
        
        data.books.forEach(book => {
            let statusClass = '';
            if (book.rueckgabe_status.includes("Überfällig")) {
                statusClass = "overdue"; // Red color for overdue
            } else if (book.rueckgabe_status.includes("Verbleibende")) {
                statusClass = "upcoming"; // Orange color for upcoming
            }

            tableContent += `
                <tr>
                    <td>${book.titel}</td>
                    <td>${book.autor}</td>
                    <td>${book.ausleihdatum}</td>
                    <td class="${statusClass}" >${book.rueckgabe_status}</td>
                    <td><button class="return-btn" onclick="openBorrowModal('${book.buch_id}', '${book.titel}', '${book.autor}', '${book.tage_bis_rueckgabe}')"> Zurückgeben</button></td>
                </tr>
            `;
        });

        ausleihenList.innerHTML = tableContent;
        updatePagination(data.totalBooks, page);
    })
    .catch(error => {
        console.error("Fehler beim Laden der ausgeliehenen Bücher:", error);
    });
}

function updatePagination(totalBooks, currentPage) {
    const paginationContainer = document.getElementById("pagination-container");
    const totalPages = Math.ceil(totalBooks / 10);
    
    let paginationContent = '';
    for (let i = 1; i <= totalPages; i++) {
        let activeClass = i === currentPage ? 'active' : '';
        
        paginationContent += `
            <button class="pagination-btn ${activeClass}" onclick="fetchMeineAusgeliehenenBuecher('', ${i})">
                ${i}
            </button>
        `;
    }
    paginationContainer.innerHTML = paginationContent;
}


document.addEventListener("DOMContentLoaded", fetchMeineAusgeliehenenBuecher);

function openBorrowModal(buchId, titel, autor, tage_bis_rueckgabe) {
        document.getElementById("buchId").value = buchId;
    document.getElementById("buchTitel").textContent = titel;
    document.getElementById("buchAutor").textContent = autor; 
    document.getElementById("tageBisRueckgabe").textContent = tage_bis_rueckgabe; 
    let submitBtn = document.getElementById("modalSubmitBtn");
        submitBtn.setAttribute("onclick", `returnBook(${buchId})`);
    document.getElementById("borrowModal").style.display = "flex";
}
function closeModal() {
    document.getElementById("borrowModal").style.display = "none";
}

function returnBook(buchId) {
    fetch('../src/views/ausleihe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=return&buch_id=${buchId}`
    }).then(response => response.json())
      .then(() => {
          closeModal();
          fetchMeineAusgeliehenenBuecher();
      });
}

}



// page meine_ausgeliehenen_buecher
if(window.location.href.includes("meine_ausgeliehenen_buecher.html")){

    function fetchDueAndUpcomingBooks(search = "", page = 1) {
        const searchTerm = document.getElementById("searchInput").value.trim();
    
        let url = `../src/views/ausleihe.php?action=getDueAndUpcomingBooks&page=${page}`;
        
        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
        }
    
        fetch(url, {
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Serverantwort war nicht OK");
            }
            return response.json();
        })
        .then(data => {
            const booksTableBody = document.getElementById("booksTableBody");
    
            if (!data || data.books.length === 0) {
                booksTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Keine überfälligen oder bald überfälligen Bücher gefunden</td></tr>`;
                return;
            }
    
            let tableContent = "";
            
            data.books.forEach(buch => {
                // let statusClass = buch.status === "überfällig" ? "status-ueberfaellig" : "status-bald-ueberfaellig";
                // Überfällig
                // Bald überfällig in
                let statusClass = buch.rueckgabe_status.includes("Überfällig") 
                                    ? "status-ueberfaellig" 
                                    : buch.rueckgabe_status.includes("Bald überfällig") 
                                        ? "status-bald-ueberfaellig" 
                                        : ""; 
                tableContent += `
                    <tr>
                        <td>${buch.titel}</td>
                        <td>${buch.autor}</td>
                        <td>${buch.ausleihdatum}</td>
                        <td>${buch.rueckgabedatum}</td>
                        <td class="${statusClass}">${buch.rueckgabe_status}</td>
                    </tr>
                `;
            });
    
            booksTableBody.innerHTML = tableContent;
            updatePagination(data.totalBooks, page, fetchDueAndUpcomingBooks);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Daten:", error);
        });
    }
    
    function updatePagination(totalBooks, currentPage, fetchFunction) {
        const paginationContainer = document.getElementById("pagination-container");
        const totalPages = Math.ceil(totalBooks / 10);
        
        let paginationContent = "";
        for (let i = 1; i <= totalPages; i++) {
            let activeClass = i === currentPage ? "active" : "";
            
            paginationContent += `
                <button class="pagination-btn ${activeClass}" onclick="${fetchFunction.name}('', ${i})">
                    ${i}
                </button>
            `;
        }
        paginationContainer.innerHTML = paginationContent;
    }
    
    document.addEventListener("DOMContentLoaded", () => fetchDueAndUpcomingBooks());
}