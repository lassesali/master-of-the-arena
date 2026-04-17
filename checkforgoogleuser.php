<?php session_start();
/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

  $sessid = session_id();
  
if ( isset( $_GET['session'] ) )
{
  $session = strip_tags( $_GET['session'] );
}

if ( isset( $_GET['email'] ) )
{
  $email = strip_tags( $_GET['email'] );

}

if ( isset( $_GET['firstname'] ) )
{
  $firstname = strip_tags( $_GET['firstname'] );
}  

  if ( isset($session) && isset($email) && isset($firstname) )
  {
    $session = strip_tags($session);
    $email = strip_tags($email);
    $firstname = strip_tags($firstname);

    $first = $firstname;
    $mail = $email;

    if ( $mail != "" )
    {

      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      include 'DBconnect.php';
      $tableName = "am_users";
      $loginTableName = "am_login";

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
        // Lis�t��n k�ytt�j�tietokantaan pelaajan Google-tunnus, koska se puuttui sielt�
        $result = mysql_query("INSERT INTO $tableName (user_email,user_firstname) VALUES ('$mail','$firstname')");          //query

      }

      //Lis�t��n Login-tietokantaan kirjautuminen Google-tunnuksella
      $result = mysql_query("INSERT INTO $loginTableName (login_sessionid,login_firstname,login_email) VALUES ('$session','$first','$mail')");          //query

      //--------------------------------------------------------------------------
      // 3) echo result as json 
      //--------------------------------------------------------------------------
      echo json_encode($num);
    }
    else
    {
      Print "Error.";
    }
  }
  else
  {
    Print "Session not found. (" . $sessid . "," . $session . ")<br>";
  }

?>
