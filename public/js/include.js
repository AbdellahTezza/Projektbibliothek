document.addEventListener("DOMContentLoaded", function () {
    includeComponent("header", "components/header.html");
    includeComponent("footer", "components/footer.html");
});

function includeComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error("Fehler beim Laden: " + filePath);
            return response.text();
        })
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
            if (elementId === 'header') {
                menumobile(); 
                checkSession();
                getdataUser();
            }
        })
        .catch(error => console.error("Ladefehler:", error));
}

function menumobile() {
    const mobileMenuButton = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".header-right");

    if (mobileMenuButton) { 
        mobileMenuButton.addEventListener("click", function () {
            navLinks.classList.toggle("active");  
            mobileMenuButton.classList.toggle("open");  
        });
    } else {
        console.error("Mobile menu button not found!");
    }
}

function checkSession() {
    fetch('../src/views/check_session.php')
        .then(response => response.json()) 
        .then(data => {
            if (data.loggedIn) {
                if (data.role === "schuler") {
                    document.getElementById("schuler-menu").style.display = "block";
                } else if (data.role === "admin") {
                    document.getElementById("admin-menu").style.display = "block";
                }
            } else {
                console.log("Benutzer ist nicht eingeloggt. Weiterleitung zur Login-Seite.");
                window.location.href = "./login.html"; 
            }
        })
        .catch(error => {
            console.error("Fehler bei der Session-Überprüfung:", error);
        });
}

function logout() {
    fetch('../src/views/check_session.php?action=logout')
    .then(response => response.json())
    .then(data => {
        window.location.href = "./login.html";
    });
}

function editprofile() {
    document.getElementById("edit-prof").style.display = "flex";

    const passwordField = document.querySelector(".passwordField");
    passwordField.textContent = "Neues Passwort :";
        fetch(`../src/views/getUserdata.php?action=role`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("modal-title").textContent = "Schüler bearbeiten";
                document.getElementById("schuelerId").value = data.id;
                document.getElementById("vornames").value = data.vorname;
                document.getElementById("nachnames").value = data.nachname;
                document.getElementById("emails").value = data.email;
                document.getElementById("passwords").value = ""; 
            });
}

function closeMod() {
    document.getElementById("edit-prof").style.display = "none";
}

function sendSchuelerData() {
    console.log("Funktion wird ausgeführt!");

    const id = document.getElementById("schuelerId").value;
    const vorname = document.getElementById("vornames").value;
    const nachname = document.getElementById("nachnames").value;
    const email = document.getElementById("emails").value;
    const password = document.getElementById("passwords").value.trim(); 
    const bild = document.getElementById("bilder").files[0];
    const currentBild = document.getElementById("current_bilder")?.value;

    if (!vorname || !nachname || !email) {
        document.getElementById("message").innerHTML = "<p style='color: red;'>Vorname, Nachname und E-Mail sind erforderlich.</p>";
        return; 
    }

    const formData = new FormData();
    formData.append("vorname", vorname);
    formData.append("nachname", nachname);
    formData.append("email", email);

    if (password) { 
        formData.append("password", password); 
    }

    if (id) {
        formData.append("id", id);
        formData.append("action", "updateSchueler");
    }

    if (bild) {
        formData.append("bild", bild);
    }

    if (!bild && currentBild) {
        formData.append("current_bild", currentBild);
    }

    fetch("../src/views/getUserdata.php?action=updateUserdata", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log("Schüler erfolgreich aktualisiert");
            getdataUser();
            closeMod();
        } else {
            mainAlert(result.message, "error");
        } 
    })
    .catch(error => {
        console.error("Fehler beim Speichern:", error);
    });
}

function getdataUser() {
    fetch('../src/views/getUserdata.php?action=role')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log("Fehler: ", data.error);
            } else {
                const userNameElement = document.querySelector('.user-name');
                userNameElement.textContent = data.vorname + " " + data.nachname;
                document.querySelector('.user-role').textContent = data.role === "admin" ? "Administrator" : "Schüler";
                const userImage = document.getElementById("userImage");
                const userprofile = document.getElementById("userprofile");
                
                const baseUrl = "http://localhost/schulbibliothek/";
                let imagePath = data.bild ? data.bild.replace("../../", "") : "public/bilder/default-profile.png"; 
                const fullImagePath = baseUrl + imagePath;
                userImage.src = fullImagePath;
            }
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        });
}


