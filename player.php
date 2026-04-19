<?php session_start();

/*
 * Copyright (c) 2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */
header('Content-Type: application/json');

  $sessid = session_id();

if ( isset( $_GET['id'] ) )
{
  $id =  $_GET['id'];

}


  if ( isset($id) )
  {


    if ( $id != "" )
    {

      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      include 'DBconnect.php';

      // 1. Varmistetaan, että pelaaja on kirjautunut sisään
      if (isset($_SESSION['user_email'])) {
          $email = $_SESSION['user_email'];
          $tableName = "am_users";

          // 2. Tehdään turvallinen haku (Prepared Statement)
          $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_email FROM $tableName WHERE user_email = ?");
          mysqli_stmt_bind_param($stmt, "s", $email);
          mysqli_stmt_execute($stmt);
          $result = mysqli_stmt_get_result($stmt);

          if ($row = mysqli_fetch_assoc($result)) {
              
              // 3. Rakennetaan pelaajan data, joka lähetetään JavaScriptille
              // Tähän voit helposti lisätä myöhemmin esim. "level", "gold" tai "highscore" -kenttiä,
              // jos lisäät niitä tietokannan am_users -taulukkoon.
              $playerData = [
                  "id" => $row['ID'],
                  "name" => $row['user_firstname'],
                  "email" => $row['user_email']
              ];

              echo json_encode([
                  "status" => "success",
                  "player" => $playerData
              ]);
              
          } else {
              echo json_encode(["status" => "error", "message" => "Player data corrupted or not found."]);
          }
          
          mysqli_stmt_close($stmt);

      } else {
          // Jos pelaaja yrittää hakea tietoja ilman kirjautumista
          echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in."]);
      }

      mysqli_close($con);



    }
    else
    {
      Print "Error.";
    }
  }
  else
  {
    Print "Session not found. (" . $sessid . ")";
  }

?>


<?php session_start();
/*
 * player.php (PHP 8 Modernisoitu versio)
 * Hakee (tai päivittää) kirjautuneen pelaajan tiedot.
 */
header('Content-Type: application/json');

include 'DBconnect.php'; // Varmista, että Dockerissa $host = 'db'

// 1. Varmistetaan, että pelaaja on kirjautunut sisään
if (isset($_SESSION['user_email'])) {
    $email = $_SESSION['user_email'];
    $tableName = "am_users";

    // 2. Tehdään turvallinen haku (Prepared Statement)
    $stmt = mysqli_prepare($con, "SELECT ID, user_firstname, user_email FROM $tableName WHERE user_email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        
        // 3. Rakennetaan pelaajan data, joka lähetetään JavaScriptille
        // Tähän voit helposti lisätä myöhemmin esim. "level", "gold" tai "highscore" -kenttiä,
        // jos lisäät niitä tietokannan am_users -taulukkoon.
        $playerData = [
            "id" => $row['ID'],
            "name" => $row['user_firstname'],
            "email" => $row['user_email']
        ];

        echo json_encode([
            "status" => "success",
            "player" => $playerData
        ]);
        
    } else {
        echo json_encode(["status" => "error", "message" => "Player data corrupted or not found."]);
    }
    
    mysqli_stmt_close($stmt);

} else {
    // Jos pelaaja yrittää hakea tietoja ilman kirjautumista
    echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in."]);
}

mysqli_close($con);
?>