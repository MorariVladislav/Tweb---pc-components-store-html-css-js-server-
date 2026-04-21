<?php
// Verificăm dacă datele au fost trimise prin metoda POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Preluăm datele trimise din formular folosind atributele 'name'
    // Folosim htmlspecialchars pentru a preveni atacurile XSS (cod malițios introdus de utilizator)
    $nume = htmlspecialchars($_POST['nume']);
    $email = htmlspecialchars($_POST['email']);
    $mesaj = htmlspecialchars($_POST['mesaj']);
    
    // Verificăm dacă serverul a primit date goale (o măsură de siguranță extra pe lângă JS)
    if (empty($nume) || empty($email) || empty($mesaj)) {
        die("Te rog să completezi toate câmpurile.");
    }

    // Formatăm informația pe care vrem să o salvăm
    $data_curenta = date('d-m-Y H:i:s');
    $format_salvare = "[$data_curenta] Nume: $nume | Email: $email | Mesaj: $mesaj" . PHP_EOL;
    
    // SARCINA 3: Memorizarea într-un fișier a datelor
    // FILE_APPEND adaugă textul la finalul fișierului, fără a șterge ce era înainte
    file_put_contents("date_utilizatori.txt", $format_salvare, FILE_APPEND);
    
    // SARCINA 2 (Partea 2): Formarea răspunsului pentru utilizator
    echo "<div style='font-family: sans-serif; text-align: center; margin-top: 50px;'>";
    echo "<h1 style='color: #9c27b0;'>Mulțumim, $nume!</h1>";
    echo "<p>Mesajul tău a fost prelucrat și salvat cu succes pe server.</p>";
    echo "<a href='contact.html' style='color: #222; text-decoration: none; font-weight: bold;'>Întoarce-te la formular</a>";
    echo "</div>";

} else {
    // Dacă cineva accesează scriptul direct, fără să folosească formularul
    echo "Acces interzis. Te rog să folosești formularul de contact.";
}
?>