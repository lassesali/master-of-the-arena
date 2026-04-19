<?php session_start();
/*
 * regular_login.php
 * Handles regular user login and session tracking.
 */
header('Content-Type: application/json');

$sessid = session_id();


// Tarkistetaan, että lomakedata on lähetetty
if (isset($_POST['email']) && isset($_POST['password'])) {
    
    // Siivotaan sähköposti. Salasanaa EI siivota (strip_tags), jotta erikoismerkit säilyvät.
    $email = trim(strip_tags($_POST['email']));
    $password = $_POST['password'];

    if ($email !== "" && $password !== "") {
        include 'DBconnect.php'; // Dockerissa $host = 'db'
        $tableName = "am_users";
        $loginTableName = "am_login";

        // 1. Haetaan käyttäjä tietokannasta sähköpostin perusteella (Prepared Statement)
        $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_password FROM $tableName WHERE user_email = ?");
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user_row = mysqli_fetch_assoc($result);

        // 2. Varmennetaan salasana
        // Jos käyttäjä löytyi ja salasana täsmää tietokannan hashiin:
        if ($user_row && password_verify($password, $user_row['user_password'])) {
            
            // 3. TÄRKEIN VAIHE: Asetetaan sessio aktiiviseksi!
            // Tämä saa checklogin.php:n ja player.php:n tunnistamaan pelaajan.
            $_SESSION['user_email'] = $email;
            $_SESSION['user_id'] = $user_row['ID'];
            
            $first = $user_row['user_firstname'];
            $session_id = session_id();

            // 4. (Valinnainen) Kirjataan kirjautumistapahtuma ylös am_login -tauluun
            $log_stmt = mysqli_prepare($con, "INSERT INTO $loginTableName (login_sessionid, login_firstname, login_email) VALUES (?, ?, ?)");
            mysqli_stmt_bind_param($log_stmt, "sss", $session_id, $first, $email);
            mysqli_stmt_execute($log_stmt);
            mysqli_stmt_close($log_stmt);

            // 5. Palautetaan menestys JS-moottorille
            echo json_encode([
                "status" => 1, // game.js saattaa odottaa numeroa 1
                "firstname" => $first,
                "message" => "Login successful"
            ]);

        } else {
            // Salasana oli väärin tai käyttäjää ei ole
            // Emme kerro hakkerille kummasta oli kyse, jotta hän ei voi arvailla sähköposteja.
            echo json_encode(["status" => 0, "message" => "Väärä sähköpostiosoite tai salasana."]);
        }
        
        mysqli_stmt_close($stmt);
        mysqli_close($con);
        
    } else {
        echo json_encode(["status" => 0, "message" => "Sähköposti tai salasana puuttuu."]);
    }
} else {
    echo json_encode(["status" => 0, "message" => "Virheellinen pyyntö."]);
}


?>