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
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },


            body: `email=${email}&password=${password}`
         });

         let result = await response.json();
         if (result.success) {
            window.location.href = result.redirect;
            showAlert(result.message, "success");
            setTimeout(() => {
               window.location.href = result.redirect;
            }, 2000);
         } else {
            showAlert(result.message, "error");
            if (result.message === 'Benutzer nicht gefunden.') {
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
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
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
            //  alert(result.message); // Fehler anzeigen
         }
      });
   }
});

if (window.location.href.includes("dashboard.html")) {
   document.addEventListener("DOMContentLoaded", function () {
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
   document.addEventListener("DOMContentLoaded", function () {
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

   // Lade die Bücher
   function loadBooks() {
      fetch("../src/views/Books.php?action=getBooks")
         .then(response => response.json())
         .then(data => {
            console.log(data); // Überprüfe, ob die Daten korrekt zurückgegeben werden
            books = data;
            console.log("books", books);
            displayPage(currentPage); // Anzeige der aktuellen Seite
            setupPagination(books.length); // Paginierung einrichten für alle Bücher
         })
         .catch(error => console.error("Fehler beim Laden der Bücher:", error));
   }

   // Funktion zur Anzeige der Bücher auf der Seite
   function displayPage(page) {
      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";

      const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase(); // Suchbegriff holen

      // Bücher filtern nach Titel oder Autor
      const filteredBooks = books.filter(book =>
         book.titel.toLowerCase().includes(searchTerm) ||
         book.autor.toLowerCase().includes(searchTerm)
      );

      if (filteredBooks.length === 0) {
         // Keine Bücher gefunden
         tableBody.innerHTML = '<tr><td colspan="4">Keine Bücher gefunden</td></tr>';
         updatePagination(0, page); // Keine Seitenanzeige, wenn keine Bücher gefunden
         return;
      }

      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const booksToShow = filteredBooks.slice(startIndex, endIndex);

      booksToShow.forEach(book => {
         const baseUrl = "http://localhost/schulbibliothek/";
         let statusClass = ''; // Klasse für den Status
         let statusText = '';  // Anzeige-Text für den Status
         let bookImagePath = book.bild ? book.bild.replace("../../", "") : "public/bilder/default-book.png";
         let fullBookImagePath = baseUrl + bookImagePath;

         const row = document.createElement("tr");
         row.id = `book_${book.id}`;
         row.innerHTML = `
                				                          <td class="block_buecher">
                        <div class="block_buecher">
                        <span class="block_buecher_bilder">
                        <img src="${fullBookImagePath}" alt="Buchcover" class="book-image">
                        </span>
                        </div>
                        <div class="block_buecher_titel">
                        ${book.titel}
                        </div>
                        
                        </td>
                <td>${book.autor}</td>
                <td>${book.isbn}</td>
                <td>
                    <button class="edit" onclick="openModal(${book.id})"> ✏️ </button>
                    <button class="delete" onclick="deleteBook(${book.id})"> 🗑️ </button>
                </td>
            `;
         tableBody.appendChild(row);
      });

      // Paginierung aktualisieren
      updatePagination(filteredBooks.length, page);
   }

   // Funktion zur Paginierung
   function updatePagination(totalBooks, currentPage) {
      const paginationContainer = document.getElementById("pagination-container");
      paginationContainer.innerHTML = ""; // Zuerst alle bestehenden Paginierungs-Elemente löschen

      if (totalBooks === 0) {
         paginationContainer.style.display = "none"; // Wenn keine Bücher angezeigt werden, Paginierung ausblenden
         return;
      } else {
         paginationContainer.style.display = "block"; // Paginierung sichtbar machen
      }

      const totalPages = Math.ceil(totalBooks / rowsPerPage);
      let paginationContent = '';

      for (let i = 1; i <= totalPages; i++) {
         let activeClass = i === currentPage ? 'active' : '';
         paginationContent += `
                <button class="pagination-btn ${activeClass}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
      }

      paginationContainer.innerHTML = paginationContent;
   }

   // Funktion zur Seitenänderung
   function changePage(page) {
      currentPage = page;
      displayPage(currentPage); // Anzeige der neuen Seite
      setupPagination(books.length); // Paginierung nach dem Wechsel aktualisieren
   }

   // Funktion zum Setup der Paginierung
   function setupPagination(totalBooks) {
      const pagination = document.getElementById("pagination");
      pagination.innerHTML = ""; // Paginierung zurücksetzen

      const totalPages = Math.ceil(totalBooks / rowsPerPage);
      for (let i = 1; i <= totalPages; i++) {
         const button = document.createElement("button");
         button.innerText = i;
         button.classList.add("pagination-btn");
         if (i === currentPage) button.classList.add("active");
         button.addEventListener("click", () => {
            currentPage = i;
            displayPage(currentPage);
            setupPagination(totalBooks); // Paginierung nach dem Wechsel aktualisieren
         });
         pagination.appendChild(button);
      }
   }

   // Suchfunktion aktivieren
   document.getElementById("searchInput").addEventListener("input", () => {
      displayPage(currentPage); // Nach jeder Eingabe die Anzeige aktualisieren
      setupPagination(books.length); // Paginierung neu einrichten, wenn gesucht wird
   });


   // Funktion zum Öffnen des Modals (Bearbeiten oder Hinzufügen)

   function openModal(bookId) {

      console.log('Buch-ID:', books); // Überprüfe den Inhalt des books-Arrays
      console.log('Buch-ID:', bookId); // Überprüfe, ob die ID korrekt übergeben wird
      const book = books.find(b => b.id === String(bookId)); // Um den Stringvergleich zu erzwingen
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
         document.getElementById("beschreibung").value = book.beschreibung;

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
   closeModalBtn.onclick = function () {
      closeModal(); // Modal schließen
   };

   // Schließen durch Klick außerhalb des Modals
   window.onclick = function (event) {
      const modal = document.getElementById("bookModal");
      if (event.target === modal) {
         closeModal(); // Modal schließen
      }
   };

   document.getElementById("bookForm").addEventListener("submit", function (event) {
      event.preventDefault();

      const bookId = document.getElementById("bookId").value;
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const isbn = document.getElementById("isbn").value;
      const beschreibung = document.getElementById("beschreibung").value; // Description
      const bild = document.getElementById("bild").files[0]; // Image file

      const formData = new FormData();
      formData.append("titel", title);
      formData.append("autor", author);
      formData.append("isbn", isbn);
      formData.append("beschreibung", beschreibung);
      if (bild) {
         formData.append("bild", bild);
      }

      let url = "../src/views/Books.php?action=addBook";
      if (bookId) {
         url = `../src/views/Books.php?action=updateBook&id=${bookId}`;
      }

      fetch(url, {
            method: "POST",
            body: formData,
         })
         .then(response => response.text()) // Use .text() to see the raw response
         .then(data => {
            console.log(data); // Log the raw response from the server
            try {
               const result = JSON.parse(data); // Manually parse the response
               showAlert(result.message, "success");
               closeModal();
               loadBooks();
            } catch (error) {
               console.error("Fehler beim Verarbeiten der Antwort:", error);
            }
         })
         .catch(error => console.error("Fehler beim Hochladen des Buches:", error));
   });


   //  // Formular-Verarbeitung (Speichern von Buch)
   //  document.getElementById("bookForm").addEventListener("submit", function (event) {
   //     event.preventDefault();

   //     const bookId = document.getElementById("bookId").value;
   //     const title = document.getElementById("title").value;
   //     const author = document.getElementById("author").value;
   //     const isbn = document.getElementById("isbn").value;

   //     const data = {
   //        titel: title,
   //        autor: author,
   //        isbn: isbn
   //     };
   //    //  alert(bookId);
   //     if (bookId) {
   //        // Buch bearbeiten
   //        fetch(`../src/views/Books.php?action=updateBook&id=${bookId}`, {
   //              method: "POST",
   //              headers: {
   //                 "Content-Type": "application/json"
   //              },
   //              body: JSON.stringify(data),
   //           })
   //           .then(response => response.json())
   //           .then(result => {
   //              // alert(result.message);
   //              showAlert(result.message, "success");
   //              books = result; // Hier wird das books-Array befüllt

   //              closeModal(); // Modal schließen
   //              loadBooks(); // Buchliste aktualisieren
   //           })
   //           .catch(error => console.error("Fehler beim Bearbeiten des Buches:", error));
   //     } else {
   //        // Neues Buch hinzufügen
   //        fetch("../src/views/Books.php?action=addBook", {
   //              method: "POST",
   //              headers: {
   //                 "Content-Type": "application/json"
   //              },
   //              body: JSON.stringify(data),
   //           })
   //           .then(response => response.json())
   //           .then(result => {
   //              // alert(result.message);
   //              showAlert(result.message, "success");
   //              closeModal(); // Modal schließen
   //              loadBooks(); // Buchliste aktualisieren
   //           })
   //           .catch(error => console.error("Fehler beim Hinzufügen des Buches:", error));
   //     }
   //  });

   // Funktion zum Löschen eines Buches
   function deleteBook(bookId) {
      if (confirm('Buch wirklich löschen?')) {
         fetch(`../src/views/Books.php?action=deleteBook&id=${bookId}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               }
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
                  loadBooks(); // Buchliste aktualisieren
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
if (window.location.href.includes("bucher.html")) {
   document.addEventListener("DOMContentLoaded", function () {
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
            console.log(data.totalBooks, "data"); // Überprüfen, ob es ein Array ist
            if (data.books.length === 0) {
               console.log("Keine Bücher gefunden!");
               const bookListElement = document.getElementById("book-list");
               if (bookListElement) {
                  bookListElement.innerHTML = '<tr><td colspan="4">Keine Bücher gefunden</td></tr>';
               }
               return; // Frühzeitig abbrechen, wenn keine Bücher gefunden wurden
            }
            const baseUrl = "http://localhost/schulbibliothek/";
  
            // Bücher rendern
            let content = data.books.map(book => {
               let bookImagePath = book.bild ? book.bild.replace("../../", "") : "public/bilder/default-book.png";
               let fullBookImagePath = baseUrl + bookImagePath;
               
               return ` 
                  <tr>
                     <td class="block_buecher">
                        <div class="block_buecher">
                           <span class="block_buecher_bilder">
                              <img src="${fullBookImagePath}" alt="Buchcover" class="book-image">
                           </span>
                        </div>
                        <div class="block_buecher_titel">
                           ${book.titel}
                        </div>
                     </td>
                     <td>${book.autor}</td>
                     <td><span class="verfugbar">${book.status_text}</span></td>
                     <td>
                        ${book.status_text === "Verfügbar" 
                           ? `<button class="borrowBook" onclick="borrowBook(${book.id})">Ausleihen</button> 
                           <button class="borrowBook" onclick="showBookDetails(${book.id}, '${book.titel}', '${book.autor}', '${fullBookImagePath}', '${book.beschreibung}')">Buchdetails</button>` 
                           : `-`}
                     </td>
                  </tr>`;
            }).join("");

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
   document.getElementById("searchInput").addEventListener("input", function () {
      fetchBooks(this.value);
   });

   function showBookDetails(id, titel, autor, fullBookImagePath, beschreibung) {
      document.getElementById("showBookDetails").style.display = "flex";
      document.getElementById("buchTitel").innerText = titel;
      document.getElementById("buchAutor").innerText = autor;
      document.getElementById("buchcover").src = fullBookImagePath;
      let beschreibungElement = document.getElementById("buchBeschreibung");
      if (beschreibungElement) {
         beschreibungElement.innerText = beschreibung ? beschreibung : "Keine Beschreibung verfügbar";
      }
      document.getElementById("buchId").value = id;

   }
   // Modal schließen
   function closeModal() {
      document.getElementById("showBookDetails").style.display = "none";
   }

   document.getElementById("modalSubmitBtn").addEventListener("click", function() {
      const buchId = document.getElementById("buchId").value;
         borrowBook(buchId);
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
         .then(response => response.json()) // Antwort als JSON parsen
         .then(data => {
            // alert(data.message);  // Zeigt die Antwortnachricht an (z.B. Erfolg oder Fehler)
            if (data.success) {
               showAlert(data.message, "success");
               closeModal(); // Modal nach erfolgreichem Ausleihen schließen
               fetchBooks(); // Die Bücherliste nach dem Ausleihen erneut laden
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

   //  function loadSchueler() {
   //     fetch("../src/views/schueler.php?action=getSchueler")
   //        .then(response => response.json())
   //        .then(data => {
   //           const tableBody = document.getElementById("table-body");
   //           tableBody.innerHTML = "";

   //           data.forEach(schueler => {
   //              const row = document.createElement("tr");
   //              row.innerHTML = `
   //                   <td>${schueler.id}</td>
   //                   <td>${schueler.vorname}</td>
   //                   <td>${schueler.nachname}</td>
   //                   <td>${schueler.email}</td>
   //                   <td>
   //                       <button class="edit" onclick="editSchueler(${schueler.id})">✏️ </button>
   //                       <button class="delete" onclick="deleteSchueler(${schueler.id})">🗑️ </button>
   //                   </td>
   //               `;
   //              tableBody.appendChild(row);
   //           });
   //        })
   //        .catch(error => console.error("Fehler beim Laden der Schüler:", error));
   //  }
   function loadSchueler(search = "", page = 1) {
      const searchTerm = document.getElementById("searchInput").value.trim();

      let url = `../src/views/schueler.php?action=getSchueler&page=${page}`;

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
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = "";

            if (!data || data.students.length === 0) {
               tableBody.innerHTML = "<tr><td colspan='5'>Keine Schüler gefunden</td></tr>";
               return;
            }

            const baseUrl = "http://localhost/schulbibliothek/";
            let imagePath = data.bild ? data.bild.replace("../../", "") : "public/bilder/default-profile.png";
            const fullImagePath = baseUrl + imagePath;
            userImage.src = fullImagePath;
            let tableContent = "";

            data.students.forEach(schueler => {
               let schuelerImagePath = schueler.bild ? schueler.bild.replace("../../", "") : "public/bilder/default-profile.png";
               let fullSchuelerImagePath = baseUrl + schuelerImagePath;
               tableContent += `
                  <tr>
                      <td>${schueler.id}</td>
                      <td><div class="avatar avatar-m"><img id="userSchule" src="${fullSchuelerImagePath}" alt="Schule Photo" class="user-photo"> </div> ${schueler.vorname} ${schueler.nachname}</td>
                      <td> <a class="fw-semibold" href="mailto:${schueler.email}">${schueler.email}</a></td>
                      <td>
                          <button class="edit" onclick="editSchueler(${schueler.id})">✏️</button>
                          <button class="delete" onclick="deleteSchueler(${schueler.id})">🗑️</button>
                      </td>
                  </tr>
              `;
            });

            tableBody.innerHTML = tableContent;
            updateSchuelerPagination(data.totalStudents, page);
         })
         .catch(error => console.error("Fehler beim Laden der Schüler:", error));
   }

   function updateSchuelerPagination(totalStudents, currentPage) {
      const paginationContainer = document.getElementById("schueler-pagination");
      const totalPages = Math.ceil(totalStudents / 10);

      let paginationContent = "";
      for (let i = 1; i <= totalPages; i++) {
         let activeClass = i === currentPage ? "active" : "";

         paginationContent += `
              <button class="pagination-btn ${activeClass}" onclick="loadSchueler('', ${i})">
                  ${i}
              </button>
          `;
      }
      paginationContainer.innerHTML = paginationContent;
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

            if (result.success === true) {
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
               // let statusClass = '';
               // if (book.rueckgabe_status.includes("Überfällig")) {
               //    statusClass = "overdue"; // Red color for overdue
               // } else if (book.rueckgabe_status.includes("Verbleibende")) {
               //    statusClass = "upcoming"; // Orange color for upcoming
               // }

               const baseUrl = "http://localhost/schulbibliothek/";
               let statusClass = ''; // Klasse für den Status
               let statusText = '';  // Anzeige-Text für den Status
               let bookImagePath = book.bild ? book.bild.replace("../../", "") : "public/bilder/default-book.png";
               let fullBookImagePath = baseUrl + bookImagePath;
               // Status bestimmen
                if (book.rueckgabe_status.includes("Überfällig")) {
                  statusClass = 'uberfallig';
                  statusText = 'Überfällig';
               } else {
                  statusClass = 'ausgeliehen';
                  statusText = 'Ausgeliehen';
               }


               tableContent += `
                 <tr>
                        <td class="block_buecher">
                        <div class="block_buecher">
                        <span class="block_buecher_bilder">
                        <img src="${fullBookImagePath}" alt="Buchcover" class="book-image">
                        </span>
                        </div>
                        <div class="block_buecher_titel">
                        ${book.titel}
                        </div>
                        </td>
                     <td>${book.autor}</td>
                     <td>${book.ausleihdatum}</td>
                     <td>
                           <span class="status-text ${statusClass}">${statusText}</span> 
                      </td>
                      <td>
                           <span class="tage-bis-rueckgabe ${statusClass}">${book.rueckgabe_status}</span>
                        </td>
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
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=return&buch_id=${buchId}`
         }).then(response => response.json())
         .then(() => {
            closeModal();
            fetchMeineAusgeliehenenBuecher();
         });
   }

}


// page meine_ausgeliehenen_buecher
if (window.location.href.includes("meine_ausgeliehenen_buecher.html")) {

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
                  const baseUrl = "http://localhost/schulbibliothek/";
                  let statusClass = ''; // Klasse für den Status
                  let statusText = '';  // Anzeige-Text für den Status
                  let bookImagePath = buch.bild ? buch.bild.replace("../../", "") : "public/bilder/default-book.png";
                  let fullBookImagePath = baseUrl + bookImagePath;
                  if (buch.rueckgabe_status.includes("Bald überfällig")) {
                     statusClass = 'ausgeliehen';
                     statusText = 'Ausgeliehen';
                  } else if (buch.rueckgabe_status.includes("Überfällig seit")) {
                     statusClass = 'uberfallig';
                     statusText = 'Überfällig';
                  } 

               tableContent += `
                     <tr>
			        <td class="block_buecher">
                        <div class="block_buecher">
                        <span class="block_buecher_bilder">
                        <img src="${fullBookImagePath}" alt="Buchcover" class="book-image">
                        </span>
                        </div>
                        <div class="block_buecher_titel">
                        ${buch.titel}
                        </div>
                        </td>
                         <td>${buch.autor}</td>
                         <td>${buch.ausleihdatum}</td>
                         <td>${buch.rueckgabedatum}</td>
                        <td>
                           <span class="status-text ${statusClass}">${statusText}</span> 
                        </td>

                         <td><span class="tage-bis-rueckgabe ${statusClass}">${buch.rueckgabe_status} </span></td>
                        <td>
                           ${buch.rueckgabe_status.includes("Überfällig") 
                              ? `<button class="return-btn" onclick="returnBook(${buch.buch_id})" data-id="${buch.buch_id}">Zurückgeben</button>`
                              : `-`}
                        </td>
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

   function returnBook(buchId) {
      fetch('../src/views/ausleihe.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=return&buch_id=${buchId}`
         }).then(response => response.json())
         .then(data => {  
            showAlert(data.message, "success");  
            fetchDueAndUpcomingBooks();
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


if (window.location.href.includes("bucherverwaltung.html")) {
   // Funktion zum Laden der Bücher basierend auf dem Suchbegriff
   function openBorrowModal(buchId, titel, autor, tageBisRueckgabe = "", vorname = "", nachname = "", schuelerId = "") {
      document.getElementById("buchId").value = buchId;
      document.getElementById("buchTitel").textContent = titel;
      document.getElementById("buchAutor").textContent = autor;

      let modalTitle = document.getElementById("modalTitle");
      let schuelerSelectContainer = document.getElementById("schuelerSelectContainer");
      let schuelerInfoContainer = document.getElementById("schuelerInfoContainer");
      let entliehenVon = document.getElementById("entliehenVon");
      let tageBisRueckgabeElement = document.getElementById("tageBisRueckgabe");
      let submitBtn = document.getElementById("modalSubmitBtn");

      if (vorname && nachname) {
         // Fall: Zurückgeben
         modalTitle.textContent = "Buch zurückgeben";
         schuelerSelectContainer.style.display = "none";
         schuelerInfoContainer.style.display = "block";
         entliehenVon.textContent = `${vorname} ${nachname}`;
         tageBisRueckgabeElement.textContent = tageBisRueckgabe || "-";
         submitBtn.textContent = "Buch zurückgeben";
         submitBtn.setAttribute("onclick", `returnBook(${buchId}, ${schuelerId})`);
      } else {
         modalTitle.textContent = "Buch ausleihen";
         schuelerSelectContainer.style.display = "block";
         schuelerInfoContainer.style.display = "none";
         submitBtn.textContent = "Buch ausleihen";
         submitBtn.setAttribute("onclick", `borrowBook(${buchId})`);

         // Schüler-Liste laden
         fetch("../src/views/schueler.php?action=getSchueler")
            .then(response => response.json())
            .then(data => {

               let schuelerSelect = document.getElementById("schuelerSelect");
               schuelerSelect.innerHTML = "";
               data.students.forEach(schueler => {
                  let option = document.createElement("option");
                  option.value = schueler.id;
                  option.textContent = `${schueler.vorname} ${schueler.nachname}`;
                  schuelerSelect.appendChild(option);
               });
            });
      }

      document.getElementById("borrowModal").style.display = "flex";
   }

   function closeModal() {
      document.getElementById("borrowModal").style.display = "none";
   }


   function borrowBook(buchId) {
      let schuelerId = document.getElementById("schuelerSelect").value;
      if (!schuelerId) return alert("Bitte einen Schüler auswählen!");

      fetch('../src/views/ausleihe.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=borrow&buch_id=${buchId}&schueler_id=${schuelerId}`
         }).then(response => response.json())
         .then(() => {
            closeModal();
            searchBooks();
         });
   }

   function returnBook(buchId, schuelerId) {
      fetch('../src/views/ausleihe.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=return&buch_id=${buchId}&schueler_id=${schuelerId}`
         }).then(response => response.json())
         .then(() => {
            closeModal();
            searchBooks();
         });
   }


   function searchBooks(page = 1) {
      const searchTerm = document.getElementById("searchInput").value.trim();
      let url = searchTerm ?
         `../src/views/ausleihe.php?search=${encodeURIComponent(searchTerm)}&page=${page}` :
         `../src/views/ausleihe.php?action=getBooks&page=${page}`;

      fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error('Serverantwort war nicht OK');
            }
            return response.json();
         })
         .then(data => {
            let tableContent = '';
           

            if (data.books.length === 0) {
               tableContent = '<tr><td colspan="5">Keine Bücher gefunden</td></tr>';
            } else {

               data.books.forEach(book => {
                  const baseUrl = "http://localhost/schulbibliothek/";
                  let statusClass = ''; // Klasse für den Status
                  let statusText = '';  // Anzeige-Text für den Status
                  let bookImagePath = book.bild ? book.bild.replace("../../", "") : "public/bilder/default-book.png";
                  let fullBookImagePath = baseUrl + bookImagePath;
                  // Status bestimmen
                  if (book.status_text.includes("Verfügbar")) {
                     statusClass = 'verfugbar';
                     statusText = 'Verfügbar';
                  } else if (book.status_text.includes("Ausgeliehen")) {
                     statusClass = 'ausgeliehen';
                     statusText = 'Ausgeliehen';
                  } else if (book.status_text.includes("Überfällig")) {
                     statusClass = 'uberfallig';
                     statusText = 'Überfällig';
                  } else {
                     statusClass = 'verbleibende';
                     statusText = 'Verbleibende';
                  }
               
                  tableContent += `
                     <tr>
                        <td class="block_buecher">
                        <div class="block_buecher">
                        <span class="block_buecher_bilder">
                        <img src="${fullBookImagePath}" alt="Buchcover" class="book-image">
                        </span>
                        </div>
                        <div class="block_buecher_titel">
                        ${book.titel}
                        </div>
                        
                        </td>
                        <td>${book.autor}</td>
                        <td>
                           <span class="status-text ${statusClass}">${statusText}</span> 
                        </td>
                        <td>
                           <span class="tage-bis-rueckgabe ${statusClass}">${book.tage_bis_rueckgabe}</span>
                        </td>
                        ${book.status_text.includes("Verfügbar") 
                           ? `<td>-</td><td>-</td>` 
                           : `<td class="großbuchstabe">${book.vorname}</td><td class="großbuchstabe">${book.nachname}</td>`}
                        <td>
                           ${book.status_text.includes("Verfügbar") 
                              ? `<button class="borrow-btn" onclick="openBorrowModal(${book.buch_id}, '${book.titel}', '${book.autor}')" data-id="${book.buch_id}">Ausleihen</button>` 
                              : `<button class="return-btn" onclick="openBorrowModal(${book.buch_id}, '${book.titel}', '${book.autor}', '${book.tage_bis_rueckgabe}', '${book.vorname}', '${book.nachname}', '${book.schueler_id}')" data-id="${book.buch_id}">Zurückgeben</button>`}
                        </td>
                     </tr>
                  `;
               });
               
               
               

               // Paginierung anzeigen
               const totalPages = data.totalPages && !isNaN(data.totalPages) ? data.totalPages : 1;
               let paginationContent = '';
               
               // Sicherstellen, dass `currentPage` existiert und eine Zahl ist
               const currentPage = page && !isNaN(page) ? page : 1;
               
               for (let i = 1; i <= totalPages; i++) {
                  const isActive = i === currentPage ? 'active' : '';
                  paginationContent += `<button class="pagination-btn ${isActive}" onclick="searchBooks(${i})">${i}</button>`;
               }
               
               document.getElementById("pagination").innerHTML = paginationContent;

            }



            
            // Überprüfen, ob das book-list Element existiert
            const bookListElement = document.getElementById('book-list');
            if (bookListElement) {
               bookListElement.innerHTML = tableContent;
            }
         })
         .catch(error => {
            console.error('Fehler beim Laden der Bücher:', error);
            const bookListElement = document.getElementById('book-list');
            if (bookListElement) {
               bookListElement.innerHTML = '<tr><td colspan="5">Fehler beim Laden der Daten</td></tr>';
            }
         });
   }

   // Event Listener für das Suchfeld
   document.getElementById("searchInput").addEventListener("input", searchBooks);

   // Bücher beim Laden abrufen
   document.addEventListener("DOMContentLoaded", searchBooks);
}