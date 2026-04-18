<?php 
session_start(); 

/*
 * Copyright (c) 2013-2014 Lasse Sali.
 * This project is licensed under the MIT License.
 */

include 'init.php';

?>

<!DOCTYPE html>

<html  style="backgroundSize: 100%; MozBackgroundSize: 100%; WebkitbackgroundSize: 100%; ObackgroundSize: 100%;">

<head>
<meta charset="utf-8">

<!-- disable zoom by two fingers in touchscreen -->
<meta name="viewport" content="height=device-height, width=device-width, initial-scale=0.9, minimum-scale=0.9, maximum-scale=0.9, user-scalable=no, target-densitydpi=device-dpi" />

<style>
	@import url('/style.css');
	@import url('/buttons.css');
	@import url('/tabs.css');
	@import url('/backgrounds.css');
	@import url('/inputfields.css');
	@import url('/texts.css');
</style>

<script src="js/jquery-1.9.1.min.js"></script>
<script src="js/game.js"></script>
<script src="js/mouse.js"></script>
<script src="js/browser.js"></script>
<script src="js/GuiBehavior.js"></script>
<script src="js/facebook.js"></script>
<script src="js/raphael-min.js"></script>
<!-- <script src="js/fastclick.js"></script> -->

<script>

(function($) {
  $.fn.nodoubletapzoom = function() {
      $(this).bind('touchstart', function preventZoom(e) {
        var t2 = e.timeStamp
          , t1 = $(this).data('lastTouch') || t2
          , dt = t2 - t1
          , fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) return; // not double-tap

        e.preventDefault(); // double tap - prevent the zoom
        // also synthesize click events we just swallowed up
        $(this).trigger('click').trigger('click');
      });
  };
})(jQuery);




// Define console to avoid errors when Firebug isn't available
if (!window.console) {var console = {};} 
if (!console.log) {console.log = function() {};} 


var fbLogin = new facebookLogin();
var mouse;
var game;

var fullscreen=<?php if ( isset($fullscreen) ) { echo $fullscreen ; } else { echo "0"; }?>;

  
var supports = (function() {  
	var div = document.createElement('div'),  
	vendors = 'Khtml Ms O Moz Webkit'.split(' '),  
	len = vendors.length;  
	return function(prop) {  
		if ( prop in div.style ) 
		{ 
			return true;  
		}
		prop = prop.replace(/^[a-z]/, function(val) 
		{  
			return val.toUpperCase();  
		});  
		while(len--) 
		{  
			if ( vendors[len] + prop in div.style ) 
			{  
				// browser supports box-shadow. Do what you need.  
				// Or use a bang (!) to test if the browser doesn't.  
				return true;  
			}  
		}  
		return false;  
	};  
})(); 



function supportsBackgroundSize()
{
	var div = document.createElement('div');
	document.body.appendChild(div);
	$(div).css('backgroundSize', 'cover');
	var result = window.getComputedStyle ? window.getComputedStyle(div, null).backgroundSize : div.currentStyle.backgroundSize;
	// Returns 'cover' in IE < 9 as well
	if (result == 'cover' ) 
	{
		return true; 
	}
	else
	{ 
		return false;
	}
}






ibrowser = new Browser();
guiB = new GUIBehavior();
guiB.setBrowser (ibrowser);



  function redirect(pointerBrowser)
  {

    var location = 'http://localhost:8080/login.php?language=<?php echo $language; ?>';

    if ( pointerBrowser.isFullScreen() == TRUE  )
    {
      location = location + '&fullscreen=1';   
      //alert("Added &fullscreen=1 to URL.");
    }

    window.location = location;

  }

  function redirecttogame()
  {
    alert( 'http://localhost:8080/index.php?logingoogle=1&session=<?php echo $sessid; ?>&name=<?php echo $user_firstname_google; ?>&email=<?php echo $user_email_google; ?>&language=<?php echo $language; ?>' );
    window.location = 'http://localhost:8080/index.php?logingoogle=1&session=<?php echo $sessid; ?>&name=<?php echo $user_firstname_google; ?>&email=<?php echo $user_email_google; ?>&language=<?php echo $language; ?>';
  }


  
  var onWindowResize = false;
  var taustat = new Array (); //for storing background divs 
  var resolution = "_640x480";
  var aika=new Date().getTime();

  var timeoffullscreentoggled=0;
  var timeofescpressed=0;
//  var is_ie11 = !!navigator.userAgent.match(/Trident\/7.0; rv 11/);
  var is_ie11 = !!navigator.userAgent.match(/Trident\/7.0/) && !!navigator.userAgent.match(/.NET4.0E/);

  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var playerFirstName;
  var is_safari = false;
  var ua = navigator.userAgent.toLowerCase(); 
  if (ua.indexOf('safari')!=-1){ 
    if(ua.indexOf('chrome')  > -1){
      // chrome
   } else {
     is_safari = true; // safari
   }
  }
  var is_opera=window.opera?1:0;
  var is_ie = /*@cc_on!@*/false;

    function isRunFromFrame() {
        if (top === self) 
        { 
          return false;
        } 
        else 
        { 
          return true;
        }
    }

  function getCurrentTime() {
    return new Date().getTime()-aika;
  }

  function googleLogin(pointerBrowser) {

     
     //setTimeout("redirect(" + pointerBrowser + ")", 300);

     setTimeout( $.proxy( redirect(pointerBrowser) , this ), 300 );  
 
  }


  function createTestButton () {
  		var testi = document.createElement("div"); 
        testi.id = "buttonTest";
	    testi.className = "button ui-state-default";
		testi.style.top = "20px";
	    testi.background = "url(gui/btn01.png)";
	    testi.innerHTML = "TEST";
	    document.getElementById('wrapper2').appendChild(testi);
  }

function isset () {
// http://kevin.vanzonneveld.net
// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: FremyCompany
  // +   improved by: Onno Marsman
  // +   improved by: Rafa&#322; Kukawski
  // *     example 1: isset( undefined, true);
  // *     returns 1: false
  // *     example 2: isset( 'Kevin van Zonneveld' );
  // *     returns 2: true
  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if (l === 0) {
    throw new Error('Empty isset');
  }

  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false;
    }
    i++;
  }
  return true;
}


  //asetetaan vakiot
  var MAIN_SCREEN = 1;
  var MANAGERS_OFFICE = 2;
  var USER_LOGIN = 3;
  var USER_WELCOME = 4;
  var INVALID_BROWSER = 6;
  var GUI_BOTTOM_TABS = 1;
  var GUI_MANAGERS_OFFICE = 2;
  var GUI_USER_LOGIN = 3;
  var GUI_USER_WELCOME = 4;
  var GUI_INVALID_BROWSER = 6;
  var GUI_TOP_BUTTONS = 5;
  var LOADING_GUI = 1;
  var NONE = 0;
  var FACEBOOK_ONLINE = 1;
  var GOOGLE_ONLINE = 2;
  var REGULAR_ONLINE = 3; // 2026: Added REGULAR_ONLINE for non-social logins
  var OFFLINE = 0;
  var UNAUTH = -1; //UNAUTHORISED (Käyttäjän Facebook-tili on auki, mutta hän ei ole antanut oikeuksia pelille)
  var TRUE = 1;
  var FALSE = 0;
  
  
  //window.onload = init;  

 function windowResize()
 {
	onWindowResize = false;
	if( isset(game) ) 
	{

		if (ibrowser.isFullScreen() == 0) 
		{
			var docElm = document.getElementById('wrapper');
			if ( $(window).width() <= 940 ) 
			{
				docElm.style.marginLeft="0px";
				docElm.style.left="0px";
			} 
			else 
			{
				docElm.style.marginLeft="-470px";
				docElm.style.left="50%";
			}

			if ( $(window).height() <= 588 ) 
			{
				docElm.style.marginTop="0px";
				docElm.style.top="0px";
			} 
			else 
			{
				docElm.style.marginTop="-294px";
				docElm.style.top="50%";
			}
		}
		else
		{
			var aika=new Date().getTime();
			if (window.screenTop || window.screenY || aika-timeofescpressed < 100) 
			{
				if (aika-timeoffullscreentoggled > 300) 
					{
						ibrowser.toggleFullScreen();
					}
			}

		}
	}
}
  
  
$(window).resize(function() {
  if ( onWindowResize == false ) {
    onWindowResize = true;
	setTimeout("windowResize()", 20);
  }
});



  $(document).ready(function(){


        $('body,div,span').nodoubletapzoom();

/*        new FastClick(document.body); */

	console.log(getAika()+"document.ready()");
	buildImageCache(0);
	if ( game.sessionid != false || game.googleloggedin != false )
	{ 
  	  console.log(getAika()+"game.init(OFFLINE...)");
	  game.init(OFFLINE,0,0,"",0);
	}
	else
	{
		fbLogin.loadSDK();
	}

  }); 

  function buildImageCache(status)
  {  
     // console.log("buildImageCache("+status+")");
       var kuvat = getVakiot(status); //getVakiot-funktio palauttaa array:n []

       for (var i=0; kuvat.length > 0; i++)
       {
         var newImage = document.createElement("img");
         newImage.setAttribute("src", kuvat.pop() + ".png" );
         document.getElementById('imagecache').appendChild(newImage);
       }
      

  }

  function getVakiot(a)
  {

    var item = [];

	var URL_START = "url(";
	var URL_END = ".png)";
	var BUTTON_01 = "gui/btn01";
	var BUTTON_02 = "gui/btn02";
	var BUTTON_01_HL = "gui/btn01hl";
	var BUTTON_02_HL = "gui/btn02hl";
	var BUTTON_01_DOWN = "gui/btn01down";
	var BUTTON_02_DOWN = "gui/btn02down";  
	var BOTTOMTAB_DEFAULT = "gui/bottomtab";
	var BOTTOMTAB_LEFTCORNER = "gui/bottomtableftcorner";
	var BOTTOMTAB_LEFTCORNER_HL = "gui/bottomtableftcornerhl";
	var BOTTOMTAB_RIGHTCORNER = "gui/bottomtabrightcorner";
	var BOTTOMTAB_RIGHTCORNER_HL = "gui/bottomtabrightcornerhl";
	var BOTTOMTAB_DEFAULT = "gui/bottomtab";
	var BOTTOMTAB_02_HL = "gui/bottomtab2";
	var BOTTOMTAB_03_HL = "gui/bottomtab3";
	var BOTTOMTAB_04_HL = "gui/bottomtab5";
	var BOTTOMTAB_05_HL = "gui/bottomtab6";
	var BOTTOMTAB_06_HL = "gui/bottomtab7";
	var BOTTOMTAB_04_SELECTED = "gui/bottomtab5selected";

    if (a == 0) //LOGIN-näkymään cachetetaan välttämättömät
    {

    item.push(BUTTON_01);
    item.push(BUTTON_02);
    item.push(BUTTON_01_HL);
    item.push(BUTTON_02_HL);
    item.push(BUTTON_01_DOWN);
    item.push(BUTTON_02_DOWN);
    item.push("gui/background_03"+resolution); //LOGIN-ikkuna
    item.push("gui/btnaudiooff");
    item.push("gui/btnaudiooffdown");
    item.push("gui/btnaudiooffhl");
    item.push("gui/btnaudioon");
    item.push("gui/btnaudioondown");
    item.push("gui/btnaudioonhl");
    item.push("gui/btnfullscreen");
    item.push("gui/btnfullscreendown");
    item.push("gui/btnfullscreenhl");
    item.push("gui/background04"+resolution); //WELCOME-ikkuna


    }

    else // käyttäjän kirjauduttua cachetetaan loput grafiikat
    {
    item.push(BOTTOMTAB_DEFAULT+resolution);
    item.push(BOTTOMTAB_LEFTCORNER+resolution);
    item.push(BOTTOMTAB_LEFTCORNER_HL+resolution);
    item.push(BOTTOMTAB_RIGHTCORNER+resolution);
    item.push(BOTTOMTAB_RIGHTCORNER_HL+resolution);
    item.push(BOTTOMTAB_DEFAULT+resolution);
    item.push(BOTTOMTAB_02_HL+resolution);
    item.push(BOTTOMTAB_03_HL+resolution);
    item.push(BOTTOMTAB_04_HL+resolution);
    item.push(BOTTOMTAB_05_HL+resolution);
    item.push(BOTTOMTAB_06_HL+resolution);
    item.push(BOTTOMTAB_04_SELECTED+resolution);
    item.push("gui/background02"+resolution);
    //item.push("gui/background_new_01"+resolution);
    }

    if ( a == 1 ) //Chromelle preladataan HD-skinit, jos peliä ei pelata Facebook-canvaksesta käsin
    {
    item.push(BOTTOMTAB_DEFAULT);
    item.push(BOTTOMTAB_LEFTCORNER);
    item.push(BOTTOMTAB_LEFTCORNER_HL);
    item.push(BOTTOMTAB_RIGHTCORNER);
    item.push(BOTTOMTAB_RIGHTCORNER_HL);
    item.push(BOTTOMTAB_DEFAULT);
    item.push(BOTTOMTAB_02_HL);
    item.push(BOTTOMTAB_03_HL);
    item.push(BOTTOMTAB_04_HL);
    item.push(BOTTOMTAB_05_HL);
    item.push(BOTTOMTAB_06_HL);
    item.push(BOTTOMTAB_04_SELECTED);
    item.push("gui/background02_1920x1080");
    item.push("gui/background04_1920x1080");
    //item.push("gui/background_new_01_1920x1080");
    item.push("gui/background_03_1920x1080");
    }

    return item;
  }

  function getAika() {
    var uAika = new Date( new Date().getTime()-aika );
    var mAika = "["+uAika.getMinutes() + "m " + uAika.getSeconds() + "s " + uAika.getMilliseconds() + "ms]: ";
    return mAika;
  }
  
  function googleinit(userid) {
           if ( ( userid != false) ) 
           {

            var param = 'id='+userid;
            $.ajax({                                     
              url: 'player.php',                          
              data: param,                        
              dataType: 'json',                //data format      
              success: function(data)          //on receive of reply
              {
                playerFirstName = data;
                // console.log("playerFirstName received: "+ data + " " + getAika() );
                game.initState(GOOGLE_ONLINE,fullscreen);
              } 
            });    
           
           }
  }
  
game = new Game();
game.sessionid = <?PHP echo $session; ?>;
game.setBrowser(ibrowser);
game.setGUIBehavior(guiB);
game.setMouse(mouse);  
game.googleloggedin=<?php if ( isset($_SESSION['googleloggedin']) ) { echo "'" . $_SESSION['googleloggedin'] . "'"; } else { echo "false"; }?>;
fbLogin.setGamePointer(game);
fbLogin.passURLFullscreenParameter(fullscreen);
game.setFbLogin(fbLogin);



function sessionDestroyer() {
/*
	$.ajax({                                     
		url: 'session.php',                          
		data: 'destroy=true',                        
		dataType: 'json',                //data format      
		success: function(data)          //on receive of reply
		{
			var num = data;              
		} 
	});
	*/
}

var languageData;

var selectedLanguage = '<?php echo $language ?>' + '.xml';


		

  
</script>

</head>

<body id="body_id" onUnload="sessionDestroyer()">

  <div id="fb-root"></div>
  
  <!-- Ladataan ääniefektit -->
  <audio id="FXclick" preload="auto">
    <source src="gui/buttonswap.wav" type="audio/wav">
	<source src="gui/buttonswap.aac" type="audio/aac">
	<source src="gui/buttonswap.mp3" type="audio/mp3">
  </audio> 
  <audio id="FXclose" preload="auto">
    <source src="gui/close.wav" type="audio/wav">
	<source src="gui/close.aac" type="audio/aac">
    <source src="gui/close.mp3" type="audio/mp3">
  </audio> 
  <audio id="FXselectionpressed" preload="auto">
    <source src="gui/selectionpressed.wav" type="audio/wav">
	<source src="gui/selectionpressed.aac" type="audio/aac">
	<source src="gui/selectionpressed.mp3" type="audio/mp3">
  </audio> 
  <audio id="FXbottomtabswap" preload="auto">
    <source src="gui/bottomtabswap.wav" type="audio/wav">
    <source src="gui/bottomtabswap.aac" type="audio/aac">
	<source src="gui/bottomtabswap.mp3" type="audio/mp3">
  </audio> 
  

  <!-- Käyttöliittymä -->
  <!-- blocks double-taps -->
  <div style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"></div>

  <div id="wrapper">

    <div id="wrapper2">
	    <div style="position: absolute; margin-left: -25px; margin-top: -25px; left: 50%; top: 50%;">
		  <div class="circle"></div>
		  <div class="circle1"></div>
		</div>
	</div>

<div id="leftad" style="visibility: hidden; border: 1px solid; width: 160px; height: 600px; position: relative; left: -161px;">
</div>

  </div>
<div id="debugbox" style="visibility: hidden; background: white; font-size: 1.5em; display: block; position: absolute; bottom: 20px; width:1280px; height:50px;">
</div>
<div id="imagecache" style="display: none;"></div>



  <!-- Musiikkisoitin -->

  <audio id="musicPlayer" autoplay="autoplay" style="position: relative; top: 0px; left: 0px;";>
    <source src="gui/arena_test1.ogg" type="audio/ogg">
    <source src="gui/arena_test1.mp3" type="audio/mpeg">
	Your browser does not support the audio element.
  </audio>



<?php
if ( !isset($logingoogle) && $user_email_google != "")
{
  echo "<script> game.checkForGoogleAccount('" . $user_firstname_google . "', '" . $user_email_google . "', '" . $sessid . "');</script>";
} 



?>



</body>
