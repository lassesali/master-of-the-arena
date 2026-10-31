<?php
declare(strict_types=1);
ini_set('zend.exception_ignore_args', '1');
session_start(); 

/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

$sessid = session_id();


if ( isset( $_GET['fullscreen'] ) && is_string( $_GET['fullscreen'] ) && $_GET['fullscreen'] === '1' )
{
  $fullscreen = "1";

}



$allowedLanguages = ['English', 'Finnish', 'French', 'German', 'Portuguese', 'Spanish'];
if ( isset( $_GET['language'] ) && is_string( $_GET['language'] ) && in_array( $_GET['language'], $allowedLanguages, true ) )
{
  $language = $_GET['language'];

}
else
{
  http_response_code(400);
  print "Error.";
}

/*
require_once 'openid.php'; 

$openid = new LightOpenID('http://localhost:8080/');

 $openid->identity = 'https://www.google.com/accounts/o8/id';
  $openid->required = array(
    'namePerson/first',
    'namePerson/last',
    'contact/email',
  );
*/

//$openid->returnUrl = 'http://proto.masterofarena.com/index.php?session=' . $sessid . '&language=' . $language;
/*
$urli = 'http://localhost:8080/index.php?session=' . $sessid . '&language=' . $language;

if ( isset($fullscreen) ) 
{
  $urli = $urli . '&fullscreen=' . $fullscreen;
}


$openid->returnUrl = $urli;


header('Location: ' . $openid->authUrl());
*/

?>
