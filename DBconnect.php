<?php
/*
 * Copyright (c) 2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */
      include 'DBconfig.php';
      $con = mysql_connect($host,$user,$pass);
      $dbs = mysql_select_db($databaseName, $con);
?>