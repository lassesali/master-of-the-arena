<?php session_start();
/*
 * checkforgoogleuser.php (PHP 8 / Modernisoitu versio)
 * TÄMÄ TIEDOSTO ON NYT KORVATTU UUDELLA checklogin.php -LOGIIKALLA.
 * * Jos game.js kutsuu vielä tätä tiedostoa, se palauttaa samat tiedot
 * kuin checklogin.php, jotta peli ei mene rikki.
 */
header('Content-Type: application/json');

include 'DBconnect.php'; // Varmista, että tässä on mysqli_connect

// Tarkistetaan onko sessio aktiivinen (luotamme nyt PHP:n sessioihin, ei $_GET-parametreihin)
if (isset($_SESSION['user_email']) && $_SESSION['user_email'] !== "") {
    
    $email = $_SESSION['user_email'];
    $tableName = "am_users";

    // Käytetään Prepared Statementia turvallisuuden takia
    $stmt = mysqli_prepare($con, "SELECT ID, user_firstname FROM $tableName WHERE user_email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        // Palautetaan ykkönen (1) niinkuin alkuperäinen koodi teki (json_encode($num))
        // mutta annetaan myös nimi mukana varmuuden vuoksi.
        echo json_encode([
            "status" => 1,
            "firstname" => $row['user_firstname']
        ]);
    } else {
        echo json_encode(["status" => 0, "message" => "User not found"]);
    }
    mysqli_stmt_close($stmt);
} else {
    // Ei voimassa olevaa sessiota
    echo json_encode(["status" => 0]);
}

mysqli_close($con);
?>