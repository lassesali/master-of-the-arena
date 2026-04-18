<?php 

/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

$sessid = session_id();

if ( isset( $_GET['logingoogle'] ) )
{
  $logingoogle = strip_tags( $_GET['logingoogle'] );

}

if ( isset( $_GET['language'] ) )
{
  $language = strip_tags( $_GET['language'] );
}

if ( isset( $_GET['session'] ) )
{
  $session = strip_tags( $_GET['session'] );
}

if ( isset( $_GET['name'] ) )
{
  $name = strip_tags( $_GET['name'] );

}

if ( isset( $_GET['email'] ) )
{
  $email = strip_tags( $_GET['email'] );

}

if ( isset( $_GET['fullscreen'] ) )
{
  $fullscreen = strip_tags( $_GET['fullscreen'] );

}


$debug = "";
$user_firstname_google = "";
$user_email_google = "";

if ( isset($name) &&  isset($email) && !isset($_SESSION['user_email_google']) )
{

    $name = strip_tags($name);
	$email = strip_tags($email);
	
	//Error: Session keys lost."
	$_SESSION['user_email_google'] = $email;
	$_SESSION['user_firstname_google'] = $name;
	
	$debug .= " P1";


}


if ( isset($_SESSION['user_email_google']) )
{

	$user_email_google = $_SESSION['user_email_google'];
	$user_firstname_google = $_SESSION['user_firstname_google'];
	
	$debug .= " E1";
} 
else
{

	$debug .= " E2";
	require_once 'openid.php';
	$openid = new LightOpenID("proto.masterofarena.com");
	if ($openid->mode) {
		if ($openid->mode == 'cancel') {
			alert ("User has canceled authentication !");
			$debug .= " V1";
		} elseif($openid->validate()) {
			$data = $openid->getAttributes();
			$user_email_google = $data['contact/email'];
			$user_firstname_google = $data['namePerson/first'];
			$_SESSION['user_email_google'] = $user_email_google;
			$_SESSION['user_firstname_google'] = $user_firstname_google;
			$debug .= " V2" . $_SESSION['user_email_google'];

		} else {
			echo "The user has not logged in";
			$debug .= " V3";
		}
	}
	else
	{
			$debug .= " V4" ;
	} 

	
}

if ( isset($session) )
{
	$debug .= " E7";
	$session = "'" . strip_tags($session) . "'";
}
else
{
	$debug .= " E8";
  $session = "false";
}

if ( isset($language) )
{
  $language = strip_tags($language);
}
else
{
  $language = "English";
}

//print "<script>alert('" . $debug . "," . $session . "');</script>";


?>
