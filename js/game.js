/* 
 * Copyright (c) 2013-2026 Lasse Sali. 
 * This project is licensed under the MIT License.
*/

//peliolion konstruktori
function Game() {
    var gamePointer = this;
	var screenState = NONE;
	var gameState = NONE;
	var GUIStack = new Array();
	var loggedin = OFFLINE;
    var guiPinoKoko = 0;
    var browserPointer;
	var guiPointer;
    var timeOfLastInit = 0;
    var mousePointer;
    var accessToken="";
  var uid="";
  var fbMail="";
  var sessionid;
  var googleloggedin;
  var guiPino = new Array();
  var drawStateData;
  var guiFilesData;
  var textVectors = new Array();
  var audioTurnedOnByUser = false;

this.report = function()
{
alert("gamePointer:"+gamePointer 
+",screenState:"+screenState 
+",gameState:"+gameState 
+",GUIStack:"+GUIStack 
+",loggedin:"+loggedin 
+",guiPinoKoko:"+guiPinoKoko
+",browserPointer:"+browserPointer
+",guiPointer:"+guiPointer
+",timeOfLastInit:"+timeOfLastInit 
+",mousePointer:"+mousePointer
+",accessToken:"+accessToken
+",uid:"+uid
+",fbMail:"+fbMail
+",sessionid:"+sessionid
+",googleloggedin:"+googleloggedin);

} 

this.isAudioAllowed = function() {
	if ( audioTurnedOnByUser == true )
	{
		return true;
	}
	return false;
}

this.setAudioAllowed = function(state) {
	if ( state == true )
	{
		audioTurnedOnByUser = true;
	}
	else
	{
		audioTurnedOnByUser = false;
	}
	console.log("setAudioAllowed to: " + audioTurnedOnByUser);
}


this.getGuiFileName = function(param)
{
    var xml = guiFilesData;
	var tiedosto = false;
	
	$('GUIFiles',xml).each(function() 
	{
		$(this).children("GUIFile").each(function() {
			var Name = $(this).attr("Name");
			var File = $(this).attr("File"); 
			if (Name == param)
			{
				tiedosto = File;
			}
		});
		
		$(this).children("Condition").each(function() {

			var Object = $(this).attr("Object");
			var IsTrue = $(this).attr("IsTrue"); 
			

			if ( Object == "Game" && gamePointer[IsTrue]() == true )  // esim. gamePointer.isRunFromFacebook() == true
			{
				$(this).children("GUIFile").each(function() {
					var Name = $(this).attr("Name");
					var File = $(this).attr("File"); 
						  
					if (Name == param)
					{
						tiedosto = File;
					}
				});				
			}
			else
			{
				$(this).children("Else").each(function() {		
					$(this).children("GUIFile").each(function() {
						var Name = $(this).attr("Name");
						var File = $(this).attr("File"); 
							  
						if (Name == param)
						{
							tiedosto = File;
						}
					});					
				});
			}
		});
	});
	return tiedosto;
}

this.getGuiLayers = function(screen)
{
    var guiList = new Array();
	
	$('Condition',drawStateData).each(function() 
	{
	  var ScreenState = $(this).attr("ScreenState");
	  if (ScreenState == screen)
	  {
		  $(this).find("AddGUI").each(function() {
			var Name = $(this).attr("Name");
			guiList.push(Name);
		  });
	  }
	  
	});
	return guiList;
}

this.getScreenStateText = function(ScreenState)
{
	var State;
	switch(ScreenState)
	{
		case MAIN_SCREEN:
			State = "MainScreen";
			break;
		case MANAGERS_OFFICE:
			State = "ManagersOffice";
			break;
		case USER_WELCOME:
			State = "UserWelcome";
			break;
		case USER_LOGIN:
			State = "UserLogin";
			break;
		default:
			return false;
	}
	return State;
}
  
this.getUid = function()
{
  return uid;
}  

this.checkForGoogleLogin = function()
{

	var sessionid = gamePointer.sessionid;
	var googleloggedin = gamePointer.googleloggedin;

	if ( sessionid != false && googleloggedin == false )
	{

			// Check if the user is already logged in when the game loads
			$.ajax({                                     
				url: 'checklogin.php',                          
				type: 'GET', // Explicitly use GET for checking data                                
				dataType: 'json',                      
				success: function(response) {
					
					// Check the new JSON status we defined in PHP
					if (response.status === "logged_in") {
						console.log("Welcome back, " + response.firstname);
						
						// TODO: Replace googleinit() with your game's actual startup function.
						googleinit(response.player_id); // Pass the player ID to your game initialization function
						// For example: 
						// startGameMenu(response.firstname);
						
						// (Note: We completely removed the nested session.php call because 
						// session tracking is now handled securely by the backend!)

					} else {
						// response.status === "not_logged_in"
						console.log("User not logged in. Showing login screen.");
						
						// TODO: Call the function that displays your new Email/Password form
						// showLoginUI();
					}
				},
				error: function(xhr, status, error) {
					console.error("Failed to check login status:", error);
				}
			});
	}
	else if ( sessionid != false && googleloggedin != false ) 
	{
			$.ajax({                                     
			  url: 'checklogin.php',                          
			  dataType: 'json',                //data format      
			  success: function(response)          //on receive of reply
			  {
				if (response.status === "logged_in") {
					console.log("Welcome back, " + response.firstname);

				    if (response.player_id != 0)
				    {
				      console.log("attempting googleinit()");
				      googleinit(response.player_id);            
					}
					else
					{
						googleloggedin = false;
						// user has not logged in with Google or Facebook
						console.log("#2 user has not logged in with Google or Facebook");
						gamePointer.initState(OFFLINE,0);
					}
				}  
				else 
				{
					googleloggedin = false;
					// user has not logged in with Google or Facebook
					console.log("#2 user has not logged in with Google or Facebook");
					gamePointer.initState(OFFLINE,0);
				}
			  }
			});
	}
	else if ( sessionid == false && googleloggedin != false ) 
	{
				if (response.status === "logged_in") {
					console.log("Welcome back, " + response.firstname);

				    if (response.player_id != 0)
				    {
				      googleinit(response.player_id);            
					}
					else
					{
						googleloggedin = false;
						// user has not logged in with Google or Facebook
						gamePointer.initState(OFFLINE,0);
					}
				}  
				else 
				{
					googleloggedin = false;
					// user has not logged in with Google or Facebook
					gamePointer.initState(OFFLINE,0);
				}

	}	
	else
	{ // user has not logged in with Google or Facebook

	  gamePointer.initState(OFFLINE,0);
	}

}

 

this.getTimeOfLastInit = function() {
  return timeOfLastInit;
}

this.setTimeOfLastInit = function(param) {
  timeOfLastInit = param;
}

this.initializeScreen = function() {

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
}



this.init = function (state,user,access,email,fullscreen) {

	var currentTime = new Date().getTime()-aika;
	if (timeOfLastInit == 0)
	{
		timeOfLastInit = currentTime;
	} 
	else if (currentTime-timeOfLastInit < 1000) 
	{
		return false;
	} 
	else 
	{
		timeOfLastInit = new Date().getTime()-aika;
	}

	uid=user; //Facebook user ID
	accessToken=access; //Facebook accesstoken
	fbMail=email;

    // Luodaan ilmentym t olioista vain ensimm isell  Init()-funktion suorituskerralla
	if ( isset(mousePointer,true) == false ) 
	{	    
		browserPointer.init(gamePointer,guiPointer); //voidaan alustaa Browser-olio, kun Game-olio ja GUIBehavior-olio on luotu
		mousePointer = new Mouse();
		mousePointer.init(browserPointer, gamePointer, guiPointer); //voidaan alustaa hiiri, kun Game-olio on luotu

		var KEYCODE_ESC = 27;
		var KEYCODE_F11 = 122;
		// Chrome hack
		$(document).keyup(function(e) {
			if (e.keyCode == KEYCODE_ESC) 
			{ 
				//Chrome: Pressed ESC 
				var timeofescpressed = new Date().getTime();
				var aika=new Date().getTime();
				if (browserPointer.isFullScreen() == 1 && aika-timeoffullscreentoggled > 300)
				{
					browserPointer.toggleFullScreen();
				}

			} 
			else if (e.keyCode == KEYCODE_F11)
			{
				//Chrome: Pressed F11  
				var timeofescpressed = new Date().getTime();
				var aika=new Date().getTime();
				if (browserPointer.isFullScreen() == 1 && aika-timeoffullscreentoggled > 300)
				{
					browserPointer.toggleFullScreen();
				}
			}
		});
	}

	if ( state == REGULAR_ONLINE ) 
	{
		console.log(getAika() + "REGULAR_ONLINE state initialized. Fetching player data...");
		
		// We no longer need to send tokens or emails. 
		// The PHP session automatically knows who is logged in!
		$.ajax({                                     
			url: 'player.php',                                                  
			type: 'GET', // Using GET because we are just reading data                            
			dataType: 'json',                    
			success: function(response)          
			{
				if (response.status === "success")
				{
					// The player data was successfully loaded from the database!
					console.log("Player loaded successfully: " + response.player.name);
					
					// TODO: Store the player data in your game object
					// Example: this.playerName = response.player.name;
					// Example: this.playerId = response.player.id;

					// Tell the GUI to switch to the main game view
	    			gamePointer.setGameState(GUI_USER_WELCOME);
	    			gamePointer.initState(state, fullscreen);
				} 
				else
				{
					// If something went wrong (e.g., session expired)
					console.log("Failed to load player data: " + response.message);
					
					// Kick the game back to the offline/login screen
	    			gamePointer.setGameState(GUI_USER_LOGIN);
	    			gamePointer.initState(state, fullscreen);
				}
			},
			error: function(xhr, status, error) {
				console.error("AJAX Error reaching player.php:", error);
			}
		});
	} 
	else if (state == OFFLINE) 
    {
        console.log("User is OFFLINE. Displaying native login screen.");
        
        // Tässä käsketään käyttöliittymää (GUI) näyttämään kirjautumisruutu.
	    gamePointer.setGameState(GUI_USER_LOGIN);
	    gamePointer.initState(state, fullscreen);
    } 

}


this.setBrowser = function (item) {
  browserPointer = item;
}

this.setGUIBehavior = function (item) {
  guiPointer = item;
}

this.setMouse = function (item) {
  mousePointer = item;
}


/* Ajetaanko ohjelmaa apps.facebook.com -osoitteesta k sin */
	this.isRunFromFacebook = function () {
		if ( ( window.innerWidth == $('div#wrapper').width() ) || ( window.innerWidth == $('div#wrapper').width()*2 ) )
		{

			return FALSE;   
		}
		else
		{
			if ( top.frames.length != 2 && isRunFromFrame() == true ) 
			{
				return TRUE;
			}
		}
		return false;
	}

this.addGUI = function(item) {
	GUIStack.push(item);
}

this.takeGUI = function() {
	var item = GUIStack.pop();
	return item;
}

this.numberOfGUI = function() {
	return GUIStack.length;
}

//palautetaan nykyinen n kym 
this.getScreenState = function() {
	return screenState;
}

//asetetaan uusi n kym 
this.setScreenState = function(state,redraw) {
	if (gamePointer.getGameState != LOADING_GUI)
	{
		screenState = state;
		if (redraw == true)
		{
			gamePointer.redrawScreenState();
		}
		
	}
	else
	{
		alert("Critical Error.");
	}
}

//palautetaan nykyinen tila
this.getGameState = function() {
	return gameState;
}

//asetetaan uusi tila
this.setGameState = function(state) {
	gameState = state;
}

//palautetaan nykyinen loggedin-tila
this.getLoggedin = function() {
	return loggedin;
}

//asetetaan uusi loggedin-tila
this.setLoggedin = function(state) {
	loggedin = state;
	gamePointer.checkLoggedin();
}

this.checkLoggedin = function() {
	var screen=gamePointer.getScreenState();
	var logged=gamePointer.getLoggedin();

	if( ( screen == GUI_USER_LOGIN || screen == NONE ) &&  logged == REGULAR_ONLINE )
	{

	    if ( supports('boxShadow') && supportsBackgroundSize() ) 
		{ 
                  
 		  gamePointer.setScreenState(USER_WELCOME, true);
		  if ( is_chrome || is_firefox || (is_safari && gamePointer.isRunFromFacebook()==false) )
		  {
			buildImageCache(1);
		  } else if ( is_opera || is_ie ) 
		  {
			buildImageCache(2);
		  }
        }
        else
        {
		  gamePointer.setScreenState(INVALID_BROWSER, false);
        }
	} 
	else if ( (screen != GUI_USER_LOGIN && screen != GUI_INVALID_BROWSER) && logged == OFFLINE )  
	{
        if ( supports('boxShadow') && supportsBackgroundSize() ) { 
 		  console.log("setscreenstate to USER_LOGIN "+ getAika());
		  gamePointer.setScreenState(USER_LOGIN, false);
        } else {
 		  console.log("setscreenstate to INVALID_BROWSER "+ getAika());
		  gamePointer.setScreenState(INVALID_BROWSER,false);
       }
	}
}

this.isLanguageDataReady = function()
{
	if (typeof languageData == "object")
	{
	  
	  return true;
	}
	return false;
}

this.isGUIDataReady = function()
{
	if (typeof drawStateData == "object" && typeof guiFilesData == "object")
	{
	  return true;
	}
	return false;
}


this.getDescription = function(param)
{

	param = '%' + param;

	var tags = languageData.getElementsByTagName("LocalizationPair");
	for (var i=0; i<tags.length; i++)
	{
		if ( tags[i].getAttribute("Name") == param )
		{
            
			temp = tags[i].firstChild.nodeValue;

			// chrome ja opera ei osaa n ytt   unicode-merkkej 
			if (is_chrome || is_opera)
			{
				var temp = temp.replace(/./g,function(char){
					switch(char){
						case 'ͦ':
							return '-';
							break;
					}
					return char;
				}); 
			}

			temp = gamePointer.parseMultiLineText(temp);
			return temp;
			break;
		}
	}
	
	return false;
	
}
		
this.parseMultiLineText = function(s) 
{
	return s.split(/\r?\n/); 

}

this.initState = function(state,fullscreen) {

	$.ajax({                                     
		url: 'GUIFiles.xml',                          
		data: '',                        
		dataType: 'xml',                //data format      
		success: function(data)          //on receive of reply
		{
			guiFilesData = data;
			gamePointer.checkIfReadyToDraw();
		} 
	});   	
	
	$.ajax({                                     
		url: 'DrawState.xml',                          
		data: '',                        
		dataType: 'xml',                //data format      
		success: function(data)          //on receive of reply
		{
			drawStateData = data;
			gamePointer.checkIfReadyToDraw();
		} 
	});   

	$.ajax({
		url: selectedLanguage,
		type:'HEAD',
		error: function()
		{
			$.ajax({                                     
				url: 'English.xml',                          
				data: '',                        
				dataType: 'xml',                //data format      
				success: function(data)          //on receive of reply
				{
					languageData = data;
					gamePointer.checkIfReadyToDraw();
				} 
			});   
		},
		success: function()
		{
			$.ajax({                                     
				url: selectedLanguage,                          
				data: '',                        
				dataType: 'xml',                //data format      
				success: function(data)          //on receive of reply
				{
					languageData = data;
					gamePointer.checkIfReadyToDraw();
				} 
			});   
		}
	});

	gamePointer.setLoggedin(state);
	gamePointer.checkLoggedin();

        if ( browserPointer.isFullScreen() == FALSE && fullscreen == 1 ) //URL-parametrina on v litetty fullscreen=1, joka forcettaa menem  n fullscreen-tilaan
        {
            setTimeout($.proxy(  browserPointer.toggleFullScreen() , browserPointer), 3000);
        }
        else
        {
            console.log( "browserPointer.isFullScreen(): " + browserPointer.isFullScreen() + ", fullscreen: " + fullscreen );
        }



}	

this.redrawScreenState = function() {

	var state = gamePointer.getScreenState();

	if (state != NONE) {

		var list = gamePointer.getGuiLayers(gamePointer.getScreenStateText(state) );

		for(i=0; i<list.length; i++)
		{
            gamePointer.addGUI ( list[i] );

        } 
		
		guiPino = new Array(); // clear the array
		guiPinoKoko = gamePointer.numberOfGUI();
		
		taustat = new Array(); // clear the array
        for (var j=0; j < guiPinoKoko; j++)
		{
		
		    var gui = gamePointer.takeGUI();

			xmlfile = gamePointer.getGuiFileName(gui);


			$.ajax({                                     
				url: xmlfile,                          
				data: '',                        
				dataType: 'xml',                //data format      
				success: function(data)          //on receive of reply
				{
				    
					guiPino.push(data);	

					gamePointer.checkIfReadyToDraw();
			

				} 
			});    
		} // for
		
		
	}
}

this.checkIfReadyToDraw = function() 
{

	if ( guiPinoKoko == 0 && gamePointer.isLanguageDataReady() == true && gamePointer.isGUIDataReady() == true )
	{
		gamePointer.redrawScreenState();
	}
	
	if ( gamePointer.isLanguageDataReady() == true && guiPinoKoko > 0 && gamePointer.isGUIDataReady() == true )
	{
		if (guiPino.length == guiPinoKoko) 
		{
			gamePointer.clearScreen();
			for ( var j=0; j<guiPinoKoko; j++ )
			{

				gamePointer.draw( guiPino.pop() );
										   
			}
			gamePointer.drawVectors();
			console.log(getAika()+"The GUI screen has been redrawn.");
			
			
		}
	}
	

}


this.clearScreen = function() {
	var test = $('div#wrapper2').children().remove(); //Tuhotaan wrapperin sis lt 

	gamePointer.clearVectors();
}

this.clearVectors = function() {
	$("svg").remove();
	gamePointer.showHiddenTextBelowVectors();
	textVectors = new Array(); 
}

this.redrawVectors = function() {
	$("svg").remove();
	gamePointer.showHiddenTextBelowVectors();
	gamePointer.drawVectors();
}


this.draw = function(teksti) {

    var vectors = new Array();

    // BACKGROUND
    var tags = teksti.getElementsByTagName("background");
    for(var i = 0; i < tags.length; i++) 
    {
        var textList = new Array();
        var div = document.createElement("div");
        var tag = tags[i];
        var iId = tag.getElementsByTagName("id")[0].firstChild.nodeValue;
        var iClass = "background";

        var inputList = tag.getElementsByTagName("inputfield");
        for(var j = 0; j<inputList.length; j++) {
            var newD = document.createElement("div");
            var newA = document.createElement("input");
            var a = inputList[j];
            var jValue = a.getElementsByTagName("id")[0].firstChild.nodeValue;
            var kValue = a.getElementsByTagName("value")[0].firstChild.nodeValue;
            
            newD.setAttribute("id", jValue);

            if ( kValue == "password" ) {
                newA.setAttribute("type", "password"); 
            }
            else
            {
                newA.setAttribute("type", "text"); 
            }

            newA.setAttribute("class", "textInput01"); 
            newD.appendChild(newA);
            div.appendChild(newD);
        }

        var spanList = tag.getElementsByTagName("text");
        for(var j = 0; j<spanList.length; j++) 
        {
            var span = spanList[j];
            var newSpan = document.createElement("span");
            var alt = "";
            if ( span.getElementsByTagName("value")[0] != undefined )
            {
              alt = span.getElementsByTagName("value")[0].firstChild.nodeValue;
            }

            var jId = span.getElementsByTagName("id")[0].firstChild.nodeValue;
            var jValue = gamePointer.getDescription( jId + alt );
            if (jValue == false && jValue != " ")
            {
              jValue = "%" + jId + alt;
            }

            newSpan.id = jId;

            if (jValue == "$PlayerFirstName") {
                // --- 2026 ---
                if ( gamePointer.getLoggedin() == REGULAR_ONLINE ) 
                {
                    var k=document.createElement("img");
                    k.setAttribute("src", 'gui/default96x96.svg');
                    k.setAttribute("style", 'display: block; width: 15%; height: 20%;');    
                    newSpan.appendChild(k);             
                    jValue = playerFirstName;
                }
            }

            if (jValue == "$Notification") {
				jValue = ""; // We will fill this in later with JavaScript when we want to show a notification to the player. This is just a placeholder for now.	
			}

            if (jValue)
			{ 
				if ( jValue.length == 1 || gamePointer.getLoggedin() == REGULAR_ONLINE )
				{
					newSpan.appendChild(document.createTextNode(jValue));
				}
				else
				{
					for (var k=0; k<jValue.length; k++)
					{
					newSpan.appendChild(document.createTextNode(jValue[k]));  
					newSpan.appendChild(document.createElement('p')); 
					}
				}
			}

            textList.push(newSpan);
            div.appendChild(newSpan);

            if ( span.getElementsByTagName("vector")[0] != undefined && (is_ie11 || is_firefox || is_chrome) ) 
            {
                var vec = span.getElementsByTagName("vector")[0];
                var vecx = vec.getElementsByTagName("x")[0].firstChild.nodeValue;
                var vecy = vec.getElementsByTagName("y")[0].firstChild.nodeValue;
                var vecsize = vec.getElementsByTagName("size")[0].firstChild.nodeValue;
                var scalex = vec.getElementsByTagName("scalex")[0].firstChild.nodeValue;
                var scaley = vec.getElementsByTagName("scaley")[0].firstChild.nodeValue;
                var effect = "";
                var vect = [ iId, vecx, vecy, vecsize, jValue, newSpan, scalex, scaley, effect ];
                vectors.push( vect ); 
            }
        }

        div.className = iClass;
        div.id = iId;
        
        if ( iClass == "background" ) 
        {
            taustat.push( $(div) ); 
            if ( !( browserPointer.isFullScreen() ) ) 
            {
                $(div).addClass('r640x480');
            }
        } 
        
        $(div).addClass("GUIelement");
        document.getElementById('wrapper2').appendChild(div);
        
        if ( $('#hidden-resizer').length == 0 )
        {
            var xdiv = document.createElement("div");
            xdiv.id = "hidden-resizer";
            $(xdiv).css({"border":"1px solid", "z-index":"1", "top":"0", "left":"0", "position":"absolute", "background":"white", "display":"inline-block", "visibility":"hidden"});
            document.getElementById('wrapper2').appendChild(xdiv);
        }
        
        for (var l=0; l<textList.length; l++)
        {
            var elem = $(textList[l]);
            var desired_width = elem.width();             
            var resizer = $('#hidden-resizer');

            resizer.html( elem.html() );    
            resizer.css({"font-family": elem.css("font-family"), "font-size": elem.css("font-size"), "font-weight": elem.css("font-weight"), "text-shadow": elem.css("text-shadow")}); 

            // SAFE RESIZING LOGIC
            var currentSizePx = parseFloat(resizer.css("font-size"));
            var loops = 0;
            
            while(resizer.width() > desired_width && loops < 50) 
            {
                currentSizePx -= 1;
                if (currentSizePx < 8) break;
                resizer.css("font-size", currentSizePx + "px");
                loops++;
            }
            if (loops > 0) elem.css("font-size", currentSizePx + "px");
        }
    }

    //BOTTOMTAB and TOPTAB
    var tags = teksti.getElementsByTagName("tab");
    for(var i = 0; i < tags.length; i++) 
    {
        var div = document.createElement("div");
        var tag = tags[i];
        var iId = tag.getElementsByTagName("id")[0].firstChild.nodeValue;
        var iType = tag.getElementsByTagName("type")[0].firstChild.nodeValue;
        var iState = (tag.getElementsByTagName("state")[0] == undefined) ? "" : " " + tag.getElementsByTagName("state")[0].firstChild.nodeValue;
        
        var iClass = (iType == "topTab") ? "toptab" : "bottomtab";
        var luokkac = (iType == "topTab") ? "topTabContainer" : "tabContainer";
        var luokkat = (iType == "topTab") ? "topTabText" : "tabText";

        var span = document.createElement("span");
        var iValue = gamePointer.getDescription( iId );
        if (iValue == false && iValue != " ") iValue = "%" + iId;
        
        var containerDiv = document.createElement("div");
        containerDiv.className = luokkac + iState;
        
        var kValue = "";
        if ( iValue.length == 1 )
        {
            span.appendChild(document.createTextNode(iValue));
            kValue = iValue;
        }
        else
        {
            for (var k=0; k<iValue.length; k++)
            {
              span.appendChild(document.createTextNode(iValue[k])); 
              span.appendChild(document.createElement('br'));
              kValue += iValue[k] + "\n";             
            }
        }       
        
        span.className = luokkat;
        containerDiv.appendChild(span);
        div.appendChild(containerDiv);
        
        div.className = iClass;
        div.id = iId;
        
        if ( (iId == "tabBottomManagersOffice") && (gamePointer.getScreenState() == MANAGERS_OFFICE)) 
        {
            $(div).addClass("selected");
        } 
        
        if ( (iClass == "bottomtab" || iClass == "toptab") && !( browserPointer.isFullScreen() ) )
        {
            taustat.push( $(div) ); 
        }
        
        $(div).addClass("GUIelement");
        document.getElementById('wrapper2').appendChild(div);

        if ( iClass == "bottomtab" )
        {
            if ( tag.getElementsByTagName("vector")[0] != undefined && (is_ie11 || is_firefox || is_chrome) ) 
            {
                var vec = tag.getElementsByTagName("vector")[0];
                var vecx = vec.getElementsByTagName("x")[0].firstChild.nodeValue;
                var vecy = vec.getElementsByTagName("y")[0].firstChild.nodeValue;
                var vecsize = vec.getElementsByTagName("size")[0].firstChild.nodeValue;
                var scalex = vec.getElementsByTagName("scalex")[0].firstChild.nodeValue;
                var scaley = vec.getElementsByTagName("scaley")[0].firstChild.nodeValue;
                var effect = vec.getElementsByTagName("effect")[0].firstChild.nodeValue;
                var vect = [ iId, vecx, vecy, vecsize, kValue, span, scalex, scaley, effect ];
                vectors.push( vect ); 
            }       
        }
    }
    
    // BUTTON
    var tags = teksti.getElementsByTagName("button");
    for(var bi = 0; bi < tags.length; bi++) 
    { 
        var div = document.createElement("div");
        var tag = tags[bi];
        var iId = tag.getElementsByTagName("id")[0].firstChild.nodeValue;
        div.id = iId;

        var iType = (tag.getElementsByTagName("type")[0] == undefined) ? "" : tag.getElementsByTagName("type")[0].firstChild.nodeValue;
        var iState = (tag.getElementsByTagName("state")[0] == undefined) ? "" : " " + tag.getElementsByTagName("state")[0].firstChild.nodeValue;
        
        if ( iType == "normal" ) 
        {
            div.className = "button GUIelement" + iState;
            var alt = (tag.getElementsByTagName("value")[0] != undefined) ? tag.getElementsByTagName("value")[0].firstChild.nodeValue : "";
            
            var iValue = gamePointer.getDescription( iId + alt );
            if (iValue == false) iValue = "%" + iId + alt;
            
            var span = document.createElement("span");
            var text = document.createTextNode(iValue);
            span.appendChild(text);
            span.id = "text"+iId;
            span.className = "buttonText";
            div.appendChild(span);          
        }
        else 
        {
            div.className = "topButton GUIelement" + iState;
        }

        document.getElementById('wrapper2').appendChild(div);
        
        if ( $('#hidden-resizer').length == 0 )
        {
            var xdiv = document.createElement("div");
            xdiv.id = "hidden-resizer";
            $(xdiv).css({"border":"1px solid", "z-index":"1", "top":"0", "left":"0", "position":"absolute", "background":"white", "display":"inline-block", "visibility":"hidden"});
            document.getElementById('wrapper2').appendChild(xdiv);
        }        
        
        if ( iType == "normal" ) 
        {
            var elem = $('#'+iId);
            var spanElem = document.getElementById('text'+iId);
            var desired_width = elem.width()-8; 
            var resizer = $('#hidden-resizer');
            resizer.html( text.nodeValue );
            resizer.css({"font-family": elem.css("font-family"), "font-size": elem.css("font-size"), "font-weight": elem.css("font-weight"), "text-shadow": elem.css("text-shadow")}); 
            var originalHeight = resizer.height();

            // SAFE RESIZING LOGIC FOR BUTTONS
            var currentSizePx = parseFloat(resizer.css("font-size"));
            var loops = 0;
            
            while(resizer.width() > desired_width && loops < 50) 
            {
                currentSizePx -= 1;
                if (currentSizePx < 8) break;
                resizer.css("font-size", currentSizePx + "px");
                loops++;
            }
            
            if (loops > 0) {
                var newHeight = resizer.height();
                var pxDifferenceHeight = ((originalHeight - newHeight) / 2) + 'px'; // Center vertically using px
                //elem.css("font-size", currentSizePx + "px");
                //$(spanElem).css('top', pxDifferenceHeight);
            }
        }       
    }

    for (var i=0; i<vectors.length; i++)
    {
        var vect = vectors.pop();
        textVectors.push(vect);
    }

    guiPointer.updateBackground(gamePointer);
    
} // end of draw()



this.drawVectors = function()
{

	if (textVectors.length > 0)
	{
		var paper = new Raphael( document.getElementById('wrapper2'), $('#wrapper2').width(), $('#wrapper2').height() );  // 400,150
		console.log( $('#wrapper2').width() +","+$('#wrapper2').height());
	}
	
	for (var i=0; i<textVectors.length; i++)
	{
	    var vect = textVectors[i];
	    //vect : [ iId, vecx, vecy, vecsize, jValue, newSpan, scalex, scaley, effect ]
		
	    var olio = $('#'+vect[0]);
		
		
		var yla = olio.offset().top - $('#wrapper2').offset().top ;
		var vasen = olio.offset().left - $('#wrapper2').offset().left;
	   

        var kx = olio.width() * vect[1] ;
		var ky = olio.height() * vect[2] ;

		// 1 em = 10px in the 640x480 world
		var kerroin = $('#wrapper2').width() / 940 * 10;
		var pixelSize = '' + vect[3] * kerroin;
	
		//alert(olio.width()+","+olio.height()+","+kx+","+ky);
		
		if ( vect[8] == "whitewithshadow" )
		{
			var stext = paper.text(vasen+kx+1, yla+ky+1, vect[4]).attr({ "font-weight":"bold", "font-size":pixelSize, fill: "black", opacity: "0.7" });		
			var trans = "S " + vect[6] + "," + vect[7];
			stext.transform(trans);
			
  		    var text = paper.text(vasen+kx, yla+ky, vect[4]).attr({ "font-weight":"bold", "font-size":pixelSize, fill: "white" });		
			var trans = "S " + vect[6] + "," + vect[7];
			text.transform(trans);

		}
		else
		{
			var text = paper.text(vasen+kx, yla+ky, vect[4]).attr({ "font-weight":"bold", "font-size":pixelSize });		
			var trans = "S " + vect[6] + "," + vect[7];
			text.transform(trans);
		}
		
		$(vect[5]).css('display','none');
		

		
	}

}

this.showHiddenTextBelowVectors = function()
{
	for (var i=0; i<textVectors.length; i++)
	{
		var vect = textVectors[i];
	    //vect : [ iId, vecx, vecy, vecsize, jValue, newSpan, scalex, scaley ]
		
		$(vect[5]).css('display','block');
		
	}
}


}
