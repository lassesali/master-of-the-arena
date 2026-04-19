<?php 
session_start(); 

/*
 * Copyright (c) 2013-2026 Lasse Sali.
 * This project is licensed under the MIT License.
 * Modernized for PHP 8 & Native Login
 */

include 'init.php';

// If $language isn't set by init.php, provide a default to prevent JS errors
if (!isset($language)) {
    $language = 'English'; 
}
?>
<!DOCTYPE html>
<html style="backgroundSize: 100%; MozBackgroundSize: 100%; WebkitbackgroundSize: 100%; ObackgroundSize: 100%;">
<head>
<meta charset="utf-8">

<meta name="viewport" content="height=device-height, width=device-width, initial-scale=0.9, minimum-scale=0.9, maximum-scale=0.9, user-scalable=no, target-densitydpi=device-dpi" />

<style>
	@import url('/style.css');
	@import url('/buttons.css');
	@import url('/tabs.css');
	@import url('/backgrounds.css');
	@import url('/inputfields.css');
	@import url('/texts.css');
</style>

<script src="js/jquery-4.0.0.min.js"></script>
<script src="js/game.js"></script>
<script src="js/mouse.js"></script>
<script src="js/browser.js"></script>
<script src="js/GuiBehavior.js"></script>
<script src="js/raphael-2.3.0.min.js"></script>

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
        $(this).trigger('click').trigger('click');
      });
  };
})(jQuery);

// Define console to avoid errors when Firebug isn't available
if (!window.console) {var console = {};} 
if (!console.log) {console.log = function() {};} 

var mouse;
var game;
var fullscreen = <?php echo isset($fullscreen) ? $fullscreen : "0"; ?>;

var supports = (function() {  
	var div = document.createElement('div'),  
	vendors = 'Khtml Ms O Moz Webkit'.split(' '),  
	len = vendors.length;  
	return function(prop) {  
		if ( prop in div.style ) { return true; }
		prop = prop.replace(/^[a-z]/, function(val) { return val.toUpperCase(); });  
		while(len--) {  
			if ( vendors[len] + prop in div.style ) { return true; }  
		}  
		return false;  
	};  
})(); 

function supportsBackgroundSize() {
	var div = document.createElement('div');
	document.body.appendChild(div);
	$(div).css('backgroundSize', 'cover');
	var result = window.getComputedStyle ? window.getComputedStyle(div, null).backgroundSize : div.currentStyle.backgroundSize;
	if (result == 'cover' ) { return true; } else { return false; }
}

ibrowser = new Browser();
guiB = new GUIBehavior();
guiB.setBrowser (ibrowser);

var onWindowResize = false;
var taustat = new Array (); 
var resolution = "_640x480";
var aika=new Date().getTime();

var timeoffullscreentoggled=0;
var timeofescpressed=0;
var is_ie11 = !!navigator.userAgent.match(/Trident\/7.0/) && !!navigator.userAgent.match(/.NET4.0E/);
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var playerFirstName;
var is_safari = false;
var ua = navigator.userAgent.toLowerCase(); 
if (ua.indexOf('safari')!=-1){ 
    if(ua.indexOf('chrome') <= -1){ is_safari = true; }
}
var is_opera=window.opera?1:0;
var is_ie = false;

function isRunFromFrame() {
    return top !== self;
}

function getCurrentTime() {
    return new Date().getTime()-aika;
}

function isset() {
  var a = arguments, l = a.length, i = 0, undef;
  if (l === 0) { throw new Error('Empty isset'); }
  while (i !== l) {
    if (a[i] === undef || a[i] === null) { return false; }
    i++;
  }
  return true;
}

// Constants
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
var REGULAR_ONLINE = 3; // The new Native Login state
var OFFLINE = 0;
var TRUE = 1;
var FALSE = 0;

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

			if ( $(window).height() <= 588 ) {
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
  else
  {
    console.log(getAika()+"windowResize() called before game was initialized.");  
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

	console.log(getAika()+"document.ready()");
	buildImageCache(0);


  game.initializeScreen();
  
    // Initialize the game engine in OFFLINE mode first.
    // game.js will now be responsible for firing the AJAX call to checklogin.php
    // and transitioning the state to REGULAR_ONLINE if the user is logged in.
	console.log(getAika()+"game.init(OFFLINE...)");
	game.init(OFFLINE,0,0,"",0);




}); 

function buildImageCache(status) {  
    var kuvat = getVakiot(status); 
    for (var i=0; kuvat.length > 0; i++) {
        var newImage = document.createElement("img");
        newImage.setAttribute("src", kuvat.pop() + ".png" );
        document.getElementById('imagecache').appendChild(newImage);
    }
}

function getVakiot(a) {
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

    if (a == 0) {
        item.push(BUTTON_01);
        item.push(BUTTON_02);
        item.push(BUTTON_01_HL);
        item.push(BUTTON_02_HL);
        item.push(BUTTON_01_DOWN);
        item.push(BUTTON_02_DOWN);
        item.push("gui/background_03"+resolution); 
        item.push("gui/btnaudiooff");
        item.push("gui/btnaudiooffdown");
        item.push("gui/btnaudiooffhl");
        item.push("gui/btnaudioon");
        item.push("gui/btnaudioondown");
        item.push("gui/btnaudioonhl");
        item.push("gui/btnfullscreen");
        item.push("gui/btnfullscreendown");
        item.push("gui/btnfullscreenhl");
        item.push("gui/background04"+resolution); 
    } else {
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
    }

    if ( a == 1 ) {
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
        item.push("gui/background_03_1920x1080");
    }
    return item;
}

function getAika() {
    var uAika = new Date( new Date().getTime()-aika );
    return "["+uAika.getMinutes() + "m " + uAika.getSeconds() + "s " + uAika.getMilliseconds() + "ms]: ";
}

game = new Game();
game.setBrowser(ibrowser);
game.setGUIBehavior(guiB);
game.setMouse(mouse);  

function sessionDestroyer() {
    // Handled purely by backend now if needed
}

var languageData;
var selectedLanguage = '<?php echo $language; ?>' + '.xml';



</script>
</head>
<body id="body_id" onUnload="sessionDestroyer()">

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

  <div style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"></div>
  <div id="wrapper">
    <div id="wrapper2">
	    <div style="position: absolute; margin-left: -25px; margin-top: -25px; left: 50%; top: 50%;">
		  <div class="circle"></div>
		  <div class="circle1"></div>
		</div>
	</div>
    <div id="leftad" style="visibility: hidden; border: 1px solid; width: 160px; height: 600px; position: relative; left: -161px;"></div>
  </div>
  <div id="debugbox" style="visibility: hidden; background: white; font-size: 1.5em; display: block; position: absolute; bottom: 20px; width:1280px; height:50px;"></div>
  <div id="imagecache" style="display: none;"></div>

  <audio id="musicPlayer" style="position: relative; top: 0px; left: 0px;">
    <source src="gui/arena_test1.ogg" type="audio/ogg">
    <source src="gui/arena_test1.mp3" type="audio/mpeg">
	Your browser does not support the audio element.
  </audio>

<script>
  // Odotetaan käyttäjän ensimmäistä hiiren klikkausta missä tahansa päin ruutua
document.body.addEventListener('click', function startBackgroundMusic() {
    game.setAudioAllowed(true); // Ilmoitetaan pelilogiikalle, että musiikki ja ääniefektit on sallittu
    
    var bgMusic = document.getElementById('musicPlayer');
    
    if (bgMusic && bgMusic.paused) {
        // Yritetään soittaa musiikki
        var playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Musiikki soi onnistuneesti! Poistetaan tämä kuuntelija, 
                // jotta tätä ei ajeta turhaan uudestaan.
                document.body.removeEventListener('click', startBackgroundMusic);
            }).catch(function(error) {
                console.log("Autoplay estetty tai musiikin lataus epäonnistui:", error);
            });
        }
    }
});
</script>

</body>
</html>