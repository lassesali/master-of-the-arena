<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
session_start();

/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */
header('Content-Type: application/json; charset=utf-8');

$mail = (isset($_GET['mail']) && is_string($_GET['mail']) && strlen($_GET['mail']) <= 254)
    ? $_GET['mail']
    : "";

$token = (isset($_GET['token']) && is_string($_GET['token']) && strlen($_GET['token']) <= 255)
    ? $_GET['token']
    : null;

  if ( $token !== null ) {
    

    if ( isset($_SESSION['accesstoken']) && is_string($_SESSION['accesstoken']) && hash_equals($_SESSION['accesstoken'], $token) && $mail != "" )
    {



      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      require_once __DIR__ . '/DBconnect.php';
      $tableName = "am_users";


      if (isset($_SESSION['user_email']) && is_string($_SESSION['user_email']) && strlen($_SESSION['user_email']) <= 254) {
          $email = $_SESSION['user_email'];
          $tableName = "am_users";

          try {
              // 3. Haetaan käyttäjän tiedot turvallisesti Prepared Statementilla
              $stmt = mysqli_prepare($con, "SELECT user_firstname, user_email FROM $tableName WHERE user_email = ? LIMIT 1");
              
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
          } catch (Throwable $e) {
              http_response_code(500);
              echo json_encode(["status" => "error", "message" => "Database error"]);
          }
      } else {
          // Jos sessiota ei ole, palautetaan tieto siitä
          echo json_encode(["status" => "not_logged_in"]);
      }

      mysqli_close($con);

    }
    else
    {
      $num = "isset:" . (isset($_SESSION['accesstoken']) ? "1" : "0");

      echo json_encode( $num );
    }
  } 
  else 
  { 
 
    echo json_encode(200);
  }
?>

