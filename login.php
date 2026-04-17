<?php session_start(); 
/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

$sessid = session_id();


if ( isset( $_GET['fullscreen'] ) )
{
  $fullscreen = strip_tags( $_GET['fullscreen'] );

}



if ( isset( $_GET['language'] ) )
{
  $language = strip_tags( $_GET['language'] );

}
else
{
  print "Error.";
}

require_once 'openid.php'; 

$openid = new LightOpenID('http://proto.masterofarena.com');

 $openid->identity = 'https://www.google.com/accounts/o8/id';
  $openid->required = array(
    'namePerson/first',
    'namePerson/last',
    'contact/email',
  );


//$openid->returnUrl = 'http://proto.masterofarena.com/index.php?session=' . $sessid . '&language=' . $language;

$urli = 'http://proto.masterofarena.com/index.php?session=' . $sessid . '&language=' . $language;

if ( isset($fullscreen) ) 
{
  $urli = $urli . '&fullscreen=' . $fullscreen;
}


$openid->returnUrl = $urli;


header('Location: ' . $openid->authUrl());


?>
