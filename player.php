<?php session_start();
/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */
  $sessid = session_id();

if ( isset( $_GET['id'] ) )
{
  $id = strip_tags( $_GET['id'] );

}


  if ( isset($id) )
  {
    $id = strip_tags($id);

    if ( $id != "" )
    {

      //--------------------------------------------------------------------------
      // 1) Connect to mysql database
      //--------------------------------------------------------------------------
      include 'DBconnect.php';
      $tableName = "am_users";
      $con = mysql_connect($host,$user,$pass);
      $dbs = mysql_select_db($databaseName, $con);

      //--------------------------------------------------------------------------
      // 2) Query database for data
      //--------------------------------------------------------------------------
      $result = mysql_query("SELECT * FROM $tableName WHERE ID='$id'");          //query
      while($row = mysql_fetch_array($result))
      {
        $num = $row['user_firstname'];
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
