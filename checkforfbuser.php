<?php session_start();

/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */
header('Content-Type: application/json');

if ( isset( $_GET['mail'] ) )
{
  $mail = $_GET['mail'];
}


if ( isset( $_GET['token'] ) )
{
  $token = $_GET['token'];
}

  if ( isset($mail) ) {

  } else {
    $mail = "";
  }

  if ( isset($token) ) {
    

    if ( isset($_SESSION['accesstoken']) && $_SESSION['accesstoken'] == $token && $mail != "" )
    {



      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      include 'DBconnect.php';
      $tableName = "am_users";


      if (isset($_SESSION['user_email'])) {
          $email = $_SESSION['user_email'];
          $tableName = "am_users";

          // 3. Haetaan käyttäjän tiedot turvallisesti Prepared Statementilla
          $stmt = mysqli_prepare($con, "SELECT user_firstname, user_email FROM $tableName WHERE user_email = ?");
          
          // "s" tarkoittaa string-tyyppistä parametria
          mysqli_stmt_bind_param($stmt, "s", $email);
          mysqli_stmt_execute($stmt);
          $result = mysqli_stmt_get_result($stmt);
          
          if ($row = mysqli_fetch_assoc($result)) {
              // 4. Palautetaan käyttäjän tiedot pelimoottorille
              // JS-moottori (game.js) käyttää näitä pelaajan nimen näyttämiseen
              echo json_encode([
                  "status" => "success",
                  "name" => $row['user_firstname'],
                  "email" => $row['user_email']
              ]);
          } else {
              echo json_encode(["status" => "error", "message" => "User not found in database"]);
          }
          
          mysqli_stmt_close($stmt);
      } else {
          // Jos sessiota ei ole, palautetaan tieto siitä
          echo json_encode(["status" => "not_logged_in"]);
      }

      mysqli_close($con);

    }
    else
    {
      $num = "isset:" + isset($_SESSION['accesstoken']);

      echo json_encode( $num );
    }
  } 
  else 
  { 
 
    echo json_encode(200);
  }
?>

