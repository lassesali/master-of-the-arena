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

  if ( isset($session) )
  {
    $session = strip_tags($session);

    if ( $session != "" )
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
      $result = mysql_query("SELECT * FROM $loginTableName WHERE login_sessionid='$session'");          //query
      $num = false;
      while($row = mysql_fetch_array($result)){
	$email = $row['login_email'];
        
        $users_result = mysql_query("SELECT * FROM $tableName WHERE user_email='$email'");          //query
        while($users_row = mysql_fetch_array($users_result)){
          $num = $users_row['ID'];
        }
      }
 
      if ($num == false)
      {
        $num = 0;
      } 
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
    Print "Session not found. (" . $sessid . ")";
  }

?>
