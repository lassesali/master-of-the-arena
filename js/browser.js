/* 
 * Copyright (c) 2013-2026 Lasse Sali. 
 * This project is licensed under the MIT License.
*/

//selainolion konstruktori
function Browser() {
	var audioEnabled = true;
	var fullScreen = 0;
	var gamePointer;
	var guiPointer;
	//var B_aika = 0;
        var browserPointer = this;        

	this.init = function(gameObj,guiObj) {
	  gamePointer = gameObj;
	  guiPointer = guiObj;
	}
	
/* Toistaa audiotiedoston */
	this.playAudio = function(item) {
        if ( this.isAudioEnabled() && gamePointer.isAudioAllowed() )
        {
            var audio = document.getElementById(item);
            
            // Make sure the audio element actually exists before trying to play it
            if (audio) {
                var playPromise = audio.play();

                // Modern browsers return a promise from .play()
                if (playPromise !== undefined) {
                    playPromise.catch(function(error) {
                        // The browser blocked the audio (likely due to no user interaction yet)
                        // We catch it silently so it doesn't throw a red error in the console.
                        console.log("Audio '" + item + "' was blocked by the browser's autoplay policy.");
                    });
                }
            } else {
                console.warn("Attempted to play audio '" + item + "', but the element was not found.");
            }
        }
    }

/* Onko ��net p��ll� */
	this.isAudioEnabled = function() {
		return audioEnabled;
	}

/* Kytkee ��net pois p��lt� tai p��lle */
	this.toggleAudio = function() {

		var lAudioNote = document.getElementById("musicPlayer");
	    if (this.isAudioEnabled() == true) 
		{
			audioEnabled = false;
			lAudioNote.volume = 0;

		}
		else
		{
			audioEnabled = true;
			lAudioNote.volume = 1;

		}
	}


/* Onko ohjelma Koko N�ytt� -tilassa */
this.isFullScreen = function() {
	return fullScreen;
}

/* Kytkee p��lle Koko N�ytt� -tilan */
this.enableFullScreen = function() {
	/*
	var description = "window: (" + $(window).width() + "," + 
	$(window).height() + ") , document: (" + $(document).width() + "," + 
	$(document).height() + "), wrapper: (" + $('div#wrapper').width() + "," +
	$('div#wrapper').height() + "), wrapper2: (" + + $('div#wrapper2').width() + "," +
	$('div#wrapper2').height() + ")";
	console.log(description);
*/
	var docElm = document.getElementById('wrapper');
	docElm.style.marginLeft="0px";
	docElm.style.left="0px";
	docElm.style.marginTop="0px";
	docElm.style.top="0px";


	if ( !is_ie11 && !is_chrome && !is_firefox && gamePointer.isRunFromFacebook() == TRUE ) //Safari ei toimi Facebookissa
	{
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		// console.log("isRunFromFacebook == TRUE -> set winWidth and winHeight: (" + winWidth + "," + winHeight + ") " + getAika() );
	}
	else
	{
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		// console.log("isRunFromFacebook == FALSE -> set winWidth and winHeight: (" + winWidth + "," + winHeight + ") " + getAika() );
	}

	if ( winHeight * 1.60 > winWidth )
	{
		var newWidth = winWidth;
		var newHeight = Math.round(newWidth / 1.60);
		// console.log("if ( winHeight * 1.33 > winWidth ) -> set newWidth and newHeight: (" + newWidth + "," + newHeight + ") " + getAika() );
	}
	else
	{
		var newHeight = winHeight;
		var newWidth = Math.round(newHeight * 1.60);
		// console.log("if ( winHeight * 1.33 <= winWidth ) -> set newWidth and newHeight: (" + newWidth + "," + newHeight + ") " + getAika() );
	}
	document.getElementById('body_id').style.fontSize = newHeight/588*10+"px";  //588

	$('div#wrapper2').width(newWidth);
	$('div#wrapper2').height(newHeight);

	if (is_ie11 || is_chrome || is_firefox || (is_safari && gamePointer.isRunFromFacebook() == false) ) //Safari ei toimi facebookissa
	{
		$('div#wrapper2').css("left", Math.round(winWidth/2)+"px");
		$('div#wrapper2').css("marginLeft", Math.round(0-newWidth/2)+"px"); 
	} 
	else
	{
		var posx = Math.round((winWidth-newWidth)/2)+"px";
		$('div#wrapper2').css("left", posx);
	}

	var temp = new Array();

	for (var i=0; taustat.length>0; i++)
	{
		var item = taustat.pop();
		$( item ).removeClass('r640x480');
		temp.push(item); 

	}
	for (var i=0; temp.length>0; i++)
	{
		taustat.push(temp.pop());
	}
	resolution = "_1920x1080";
	
	guiPointer.updateBackground(gamePointer);
    $('div#wrapper').css('display','block');
	
	gamePointer.redrawVectors();
	
} // End of EnableFullscreen()



/* Kytkee p��lle tai kytkee pois p��lt� Koko N�ytt� -tilan */
this.toggleFullScreen = function() {
	//Fullscreen toimii vain Firefoxilla, Chromella ja Safarilla tai Facebookissa mutta ei toimi Facebookissa Safarilla
	if ( (is_ie11) || (is_firefox) || (is_chrome) || (is_safari) || ( gamePointer.isRunFromFacebook() == true) ) 
	{
		timeoffullscreentoggled = new Date().getTime();
		if (fullScreen == 0) {
			var browserTimeout = 300; //10

			if (is_ie11 || is_chrome || is_firefox || (is_safari && gamePointer.isRunFromFacebook() == false) )
			{
				var docElm = document.getElementById('wrapper');

                                if (docElm.msRequestFullscreen)
                                {
                                        docElm.msRequestFullscreen();
                                }
				else if (docElm.requestFullscreen) 
				{
					docElm.requestFullscreen();
					//console.log( "RequestFullscreen() " +getAika() );
				}
				else if (docElm.mozRequestFullScreen) 
				{
					docElm.mozRequestFullScreen();
					//console.log( "mozRequestFullscreen() " +getAika() );
				}
				else if (docElm.webkitRequestFullScreen) 
				{
                         
					browserTimeout = 300;
					docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                                     	
				//console.log( "webkitRequestFullscreen() " +getAika() );
				}
			} 
			fullScreen = 1;
	                
			setTimeout($.proxy(browserPointer.enableFullScreen, browserPointer), browserTimeout);  

		} 
		else 
		{
			if (is_ie11 || is_chrome || is_firefox || (is_safari && gamePointer.isRunFromFacebook() == false ))
			{
				var browserTimeout = 50;
				if (document.msExitFullscreen) 
				{
					document.msExitFullscreen();
					//console.log( "exitFullscreen() " +getAika() );
				}
				else if (document.exitFullscreen) 
				{
					document.exitFullscreen();
					//console.log( "exitFullscreen() " +getAika() );
				}
				else if (document.mozCancelFullScreen) 
				{
					document.mozCancelFullScreen();
					//console.log( "mozCancelFullscreen() " +getAika() );
				}
				else if (document.webkitCancelFullScreen) 
				{
					var browserTimeout = 300;
					document.webkitCancelFullScreen();
					//console.log( "webkitCancelFullscreen() " +getAika() );
				}
			}

			fullScreen = 0;
			var docElm = document.getElementById('wrapper');
			docElm.style.marginLeft="-470px";
			docElm.style.marginTop="-294px";
			docElm.style.top="50%";
			docElm.style.left="50%";
//940x570 940x588  470 285     470 294
                        var docElm = document.getElementById('leftad');
                        docElm.style.top="0";
			docElm.style.marginLeft="0";
			docElm.style.left="941px";

			document.getElementById('body_id').style.fontSize = "10px";
			$('div#wrapper2').width("940px");
			$('div#wrapper2').height("588px"); //588

			var docElm = document.getElementById('wrapper2');
			docElm.style.marginLeft="0";
			docElm.style.left="0";


			var temp = new Array();
			for (var i=0; taustat.length>0; i++)
			{
				var item = taustat.pop();
				$( item ).addClass('r640x480');
				temp.push(item); 

			}
			for (var i=0; temp.length>0; i++)
			{
				taustat.push(temp.pop());
			}

			resolution = "_640x480";

			guiPointer.updateBackground(gamePointer);                      
			
            var browserTimeout=50;

            gamePointer.redrawVectors();   
		
		}
	} 
	else
	{
		//alert("Error! Your browser does not support full screen. ");
	}
} // toggleFullScreen()


this.enableExitFullScreen = function() {

			var docElm = document.getElementById('wrapper');
			docElm.style.marginLeft="-470px";
			docElm.style.marginTop="-294px";
			docElm.style.top="50%";
			docElm.style.left="50%";

			document.getElementById('body_id').style.fontSize = "10px";
			$('div#wrapper2').width("940px");
			$('div#wrapper2').height("588px"); //588

			var docElm = document.getElementById('wrapper2');
			docElm.style.marginLeft="0";
			docElm.style.left="0";

			var temp = new Array();
			for (var i=0; taustat.length>0; i++)
			{
				var item = taustat.pop();
				$( item ).addClass('r640x480');
				temp.push(item); 

			}
			for (var i=0; temp.length>0; i++)
			{
				taustat.push(temp.pop());
			}

			resolution = "_640x480";

			guiPointer.updateBackground(gamePointer);                      
			
                        var browserTimeout=50;
 			setTimeout($.proxy(browserPointer.showScreen, browserPointer), browserTimeout); 

}



}
