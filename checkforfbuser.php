<?php session_start();
/*
 * Copyright (c) 2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

if ( isset( $_GET['mail'] ) )
{
  $mail = strip_tags( $_GET['mail'] );
}


if ( isset( $_GET['token'] ) )
{
  $token = strip_tags( $_GET['token'] );
}



  if ( isset($mail) ) {
    strip_tags($mail);
  } else {
    $mail = "";
  }

  if ( isset($token) ) {
    strip_tags($token);

    if ( isset($_SESSION['accesstoken']) && $_SESSION['accesstoken'] == $token && $mail != "" )
    {



      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      include 'DBconnect.php';
      $tableName = "am_users";


      //--------------------------------------------------------------------------
      // 2) Query database for data
      //--------------------------------------------------------------------------
      $result = mysql_query("SELECT * FROM $tableName WHERE user_email='$mail'");          //query
      $num = mysql_fetch_row($result);                          //fetch result    
      if ($num != false)
      {
        $num = 1;
      } 
      else
      {
        // Lis�t��n k�ytt�j�tietokantaan pelaajan fb-tunnus, koska se puuttui sielt�

        $result = mysql_query("INSERT INTO $tableName (user_email) VALUES ('$mail')");          //query
        $num = 300;
      }
      //--------------------------------------------------------------------------
      // 3) echo result as json 
      //--------------------------------------------------------------------------
      echo json_encode($num);
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
