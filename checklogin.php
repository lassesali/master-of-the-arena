<?php session_start();
/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 */
header('Content-Type: application/json');

// 1. Sisällytetään tietokanta heti alkuun
include 'DBconnect.php';

// 2. Luotetaan täysin PHP:n sisäiseen $_SESSION-muuttujaan
if (isset($_SESSION['user_email']) && $_SESSION['user_email'] !== "") {
    
    $email = $_SESSION['user_email'];
    $tableName = "am_users";

    // 3. Haetaan käyttäjän tiedot Prepared Statementilla
    try {
      // 1. Prepare the query to check if the email is already in use
      $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_email FROM $tableName WHERE user_email = ?");

    } catch (mysqli_sql_exception $e) {
      // FAILSAFE: Check if preparation failed (e.g., table doesn't exist)
      echo json_encode([
        "status" => "error", 
        "message" => "Database error (Check): " . mysqli_error($con) 
      ]);
      mysqli_close($con);
      exit;
    }

    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        // Palautetaan tiedot JSON-muodossa pelimoottorille
        echo json_encode([
            "status" => "logged_in",
            "player_id" => $row['ID'],
            "firstname" => $row['user_firstname'],
            "email" => $row['user_email']
        ]);
    } else {
        // Jos sessio on olemassa, mutta käyttäjää ei löydy kannasta
        session_destroy();
        echo json_encode(["status" => "error", "message" => "Session invalid"]);
    }
    
    mysqli_stmt_close($stmt);

} else {
    // 4. Käyttäjä ei ole kirjautunut - palautetaan puhdas JSON, ei tekstiä
    echo json_encode(["status" => "not_logged_in"]);
}

mysqli_close($con);
?>