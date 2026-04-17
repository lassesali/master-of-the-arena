<?php session_start();
/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

if ( isset( $_GET['session'] ) )
{
  $session = strip_tags( $_GET['session'] );


}

if ( isset( $_GET['destroy'] ) )
{
  $destroy = strip_tags( $_GET['destroy'] );


}

  $session = strip_tags($session);
  if ( isset($destroy) )
  {
     //remove all the variables in the session 
     session_unset(); 
 
     // destroy the session 
     session_destroy(); 
  }
  else if ( strlen($session) > 1  )
  {
    $_SESSION['googleloggedin'] = $session;
    $num = 1;

  }
  else
  {
    $num = 0;
  }



  //--------------------------------------------------------------------------
  // echo result as json 
  //--------------------------------------------------------------------------
  echo json_encode($num);

?>
