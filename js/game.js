/* 
 * Copyright (c) 2014 Lasse Sali. 
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
  var fbloginPointer;
  var guiPino = new Array();
  var drawStateData;
  var guiFilesData;
  var textVectors = new Array();
  
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
+",googleloggedin:"+googleloggedin
+",fbloginPointer:"+fbloginPointer);

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
    //console.log("function call getGuiLayers("+screen+")");
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
	console.log(getAika()+"checkForGoogleLogin()");

	var sessionid = gamePointer.sessionid;
	var googleloggedin = gamePointer.googleloggedin;

	if ( sessionid != false && googleloggedin == false )
	{
			console.log( "#1 googleloggedin:" + googleloggedin +", sessionid:" + sessionid );

			var param = 'session=' + sessionid;
			$.ajax({                                     
			  url: 'checklogin.php',                          
			  data: param,                        
			  dataType: 'json',                //data format      
			  success: function(data)          //on receive of reply
			  {
				var num = data; 
				googleinit(data);            

				$.ajax({                                     
				  url: 'session.php',                          
				  data: param,                        
				  dataType: 'json',                //data format      
				  success: function(data)          //on receive of reply
				  {
					var num = data; 
				  } 
				});
			  } 
			});
	}
	else if ( sessionid != false && googleloggedin != false ) 
	{
			console.log( "#2 googleloggedin:" + googleloggedin +", sessionid:" + sessionid );
			var param = 'session=' + sessionid;
			$.ajax({                                     
			  url: 'checklogin.php',                          
			  data: param,                        
			  dataType: 'json',                //data format      
			  success: function(data)          //on receive of reply
			  {
				var num = data; 
				if (num != 0)
				{
				  googleinit(data);            
				}
				else
				{
					fbloginPointer.loadSDK();
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
			console.log( "#3 googleloggedin:" + googleloggedin +", sessionid:" + sessionid );
			var param = 'session=' + googleloggedin;
			$.ajax({                                     
			  url: 'checklogin.php',                          
			  data: param,                        
			  dataType: 'json',                //data format      
			  success: function(data)          //on receive of reply
			  {
				var num = data; 
				if (num != 0)
				{
				  googleinit(data);            
				}
				else
				{
					fbloginPointer.loadSDK();
					googleloggedin = false;
					// user has not logged in with Google or Facebook
					console.log("#3 user has not logged in with Google or Facebook");
					gamePointer.initState(OFFLINE,0);
				}
				
			  } 
			});
	}	
	else
	{ // user has not logged in with Google or Facebook
	  fbloginPointer.loadSDK();
   	  console.log( "#4 googleloggedin:" + googleloggedin +", sessionid:" + sessionid );
	  console.log("#4 user has not logged in with Google or Facebook");
	  gamePointer.initState(OFFLINE,0);
	}

}

  
this.checkForGoogleAccount = function(name,email,session)
{
	var textdata = 'firstname=' + name + '&email=' + email + '&session=' + session; 
	$.ajax({                                     
	  url: 'checkforgoogleuser.php',                          
	  data: textdata,                        
	  dataType: 'json',                //data format      
	  success: function(data)          //on recieve of reply
	  {
		var num = data;              //get id
		if (num != false)
		{
		  // console.log("The Google account exists in the database.");


		  redirecttogame();
		} 
		else
		{
		  // console.log("The Google account did not exist in the database and was merged within.");


		  redirecttogame();

		}
	  } 
	});
}


this.getTimeOfLastInit = function() {
  return timeOfLastInit;
}

this.setTimeOfLastInit = function(param) {
  timeOfLastInit = param;
}

this.init = function (state,user,access,email,fullscreen) {

	var currentTime = new Date().getTime()-aika;
	if (timeOfLastInit == 0)
	{
		timeOfLastInit = currentTime;
	} 
	else if (currentTime-timeOfLastInit < 1000) 
	{
		console.warn(getAika()+"eliminated duplicate init() Call");
		return false;
	} 
	else 
	{
		timeOfLastInit = new Date().getTime()-aika;
	}

	uid=user; //Facebook user ID
	accessToken=access; //Facebook accesstoken
	fbMail=email;

    // Luodaan ilmentym�t olioista vain ensimm�isell� Init()-funktion suorituskerralla
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

	if ( state == FACEBOOK_ONLINE ) 
	{
	    console.log(getAika()+"checkforfbuser run.");
		var saccess = accessToken.substring(0,20);
		var param = "mail="+fbMail+"&token="+saccess;
		$.ajax({                                     
			url: 'checkforfbuser.php',                          
			data: param,                        
			dataType: 'json',                //data format      
			success: function(data)          //on recieve of reply
			{
				var num = data;              //get id
				if (num != false)
				{
					//The FB account exists in the database.

				} 
				else
				{
					//The FB account did not exist in the database and was merged within.

				}
			} 
		});
	} 
	
	if(state==OFFLINE)
	{
		gamePointer.checkForGoogleLogin();
	} 
	else  
	{
	    console.log("gamePointer.initState(state,fullscreen)");
		gamePointer.initState(state,fullscreen);
	}

    /*    
        if ( browserPointer.isFullScreen() == FALSE && fullscreen == 1 ) //URL-parametrina on v�litetty fullscreen=1, joka forcettaa menem��n fullscreen-tilaan
        {
            console.log("URL-parametrina on v�litetty fullscreen=1, joka forcettaa menem��n fullscreen-tilaan");
            browserPointer.toggleFullScreen();
            
        }
        else
        {
            console.log( "browserPointer.isFullScreen(): " + browserPointer.isFullScreen() + ", fullscreen: " + fullscreen );
        }
*/

}

this.setFbLogin = function(item) {
  fbloginPointer = item;
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


/* Ajetaanko ohjelmaa apps.facebook.com -osoitteesta k�sin */
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
        // console.log("GUIStack.length:"+GUIStack.length);
}

this.takeGUI = function() {
	var item = GUIStack.pop();
        // console.log("GUIStack.length:"+GUIStack.length);
	return item;
}

this.numberOfGUI = function() {
	return GUIStack.length;
}

//palautetaan nykyinen n�kym�
this.getScreenState = function() {
	return screenState;
}

//asetetaan uusi n�kym�
this.setScreenState = function(state,redraw) {
	if (gamePointer.getGameState != LOADING_GUI)
	{
		// console.log("setScreenState("+state+") "+getAika());
		screenState = state;
		if (redraw == true)
		{
			gamePointer.redrawScreenState();
		}
		
	}
	else
	{
		// console.log("ERROR. Calling setScreenState("+state+") when GameState is LOADING_GUI. "+getAika());
		alert("Critical Error.");
	}
}

//palautetaan nykyinen tila
this.getGameState = function() {
	return gameState;
}

//asetetaan uusi tila
this.setGameState = function(state) {
	// console.log("setGameState("+state+") "+getAika());
	gameState = state;
}

//palautetaan nykyinen loggedin-tila
this.getLoggedin = function() {
	return loggedin;
}

//asetetaan uusi loggedin-tila
this.setLoggedin = function(state) {
	// console.log("this.setLoggedin("+state+") "+getAika());
	loggedin = state;
	gamePointer.checkLoggedin();
}

this.checkLoggedin = function() {
	console.log( getAika() + "this.checkLoggedin()" );
	var screen=gamePointer.getScreenState();
	var logged=gamePointer.getLoggedin();

	if( ((screen == GUI_USER_LOGIN) || (screen == NONE)) && ( (logged == FACEBOOK_ONLINE) || (logged == GOOGLE_ONLINE) ) )
	{
		// console.log(screen +" "+ logged+" "+getAika());

                if ( supports('boxShadow') && supportsBackgroundSize() ) { 
                  
  		  // console.log("setscreenstate to USER_WELCOME. this.getLoggedin()="+logged);
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
 		  // console.log("setscreenstate to INVALID_BROWSER "+ getAika());
		  gamePointer.setScreenState(INVALID_BROWSER, false);

                }

	} else if ( (screen != GUI_USER_LOGIN && screen != GUI_INVALID_BROWSER) && ((logged == OFFLINE) || (logged == UNAUTH)) ) 
	{

                if ( supports('boxShadow') && supportsBackgroundSize() ) { 
 		  // console.log("setscreenstate to USER_LOGIN "+ getAika());
		  gamePointer.setScreenState(USER_LOGIN, false);
                } else {
 		  // console.log("setscreenstate to INVALID_BROWSER "+ getAika());
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

			// chrome ja opera ei osaa n�ytt�� unicode-merkkej�
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
    console.log(getAika()+"Game.initState() run");

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
			console.log(getAika()+drawStateData);
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
	if ( (gamePointer.getLoggedin() == GOOGLE_ONLINE) )
	{
		gamePointer.checkLoggedin();
	} 
	else 
	{
		gamePointer.checkLoggedin();
	}

        if ( browserPointer.isFullScreen() == FALSE && fullscreen == 1 ) //URL-parametrina on v�litetty fullscreen=1, joka forcettaa menem��n fullscreen-tilaan
        {
            console.log("URL-parametrina on v�litetty fullscreen=1, joka forcettaa menem��n fullscreen-tilaan");

            setTimeout($.proxy(  browserPointer.toggleFullScreen() , browserPointer), 3000);
            
            //browserPointer.toggleFullScreen();
            
        }
        else
        {
            console.log( "browserPointer.isFullScreen(): " + browserPointer.isFullScreen() + ", fullscreen: " + fullscreen );
        }



}	

this.redrawScreenState = function() {

    console.log(getAika()+" redrawScreenState()");
	var state = gamePointer.getScreenState();

	if (state != NONE) {

		var list = gamePointer.getGuiLayers(gamePointer.getScreenStateText(state) );

		for(i=0; i<list.length; i++)
		{
            gamePointer.addGUI ( list[i] );

        } 
		
		guiPino = new Array(); // clear the array
		guiPinoKoko = gamePointer.numberOfGUI();
        console.log("set guiPinoKoko to:"+gamePointer.numberOfGUI() );
		
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
    //console.log(getAika()+"checkIfReadyToDraw" );
	//console.log(gamePointer.isLanguageDataReady() + "," + guiPinoKoko +"," + guiPino.length + "," +gamePointer.isGUIDataReady());
	
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
	var test = $('div#wrapper2').children().remove(); //Tuhotaan wrapperin sis�lt�

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
    //console.log(teksti);
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
			//var kValue = getDescription( jValue );
			//if (kValue == false)
			//{
			//  kValue = "%" + jValue;
			//}			
			
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
				if ( gamePointer.getLoggedin() == FACEBOOK_ONLINE )
				{
					var k=document.createElement("img");
					k.setAttribute("src", 'http://graph.facebook.com/'+uid+'/picture');
					k.setAttribute("style", 'display: block; width: 15%; height: 20%;');
					newSpan.appendChild(k);

					jValue = "";

					var k=document.createElement("fb:name");
					k.setAttribute("uid", uid);
					k.setAttribute("capitalize", "true");
					k.setAttribute("useyou", "false");
					k.setAttribute("linked", "false");
					k.setAttribute("ifcansee", "Manager");
					k.setAttribute("firstnameonly", "true");
					newSpan.appendChild(k);
				}
				else if ( gamePointer.getLoggedin() == GOOGLE_ONLINE )
				{
					var k=document.createElement("img");
					k.setAttribute("src", 'gui/google96x96.png');
					k.setAttribute("style", 'display: block; width: 15%; height: 20%;');
					newSpan.appendChild(k);
					jValue = playerFirstName;
				}
			}

			 
			if ( jValue.length == 1 || gamePointer.getLoggedin() == GOOGLE_ONLINE)
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
			
			textList.push(newSpan);
			
			div.appendChild(newSpan);

			if ( span.getElementsByTagName("vector")[0] != undefined && (is_ie11 || is_firefox || is_chrome) ) 
			//css3:n pointer-events toimii vain harvoissa selaimissa
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
				console.log("push: "+vect);
			}

				
			
		}

		div.className = iClass;
		div.id = iId;
		
		if ( iClass == "background" ) 
		{
			taustat.push( $(div) ); //let's store the background div
			if ( !( browserPointer.isFullScreen() ) ) 
			{
				$(div).addClass('r640x480');
			}
		} 
        
		$(div).addClass("GUIelement");

		document.getElementById('wrapper2').appendChild(div);
		
		if ( gamePointer.getScreenState() == USER_WELCOME && gamePointer.getLoggedin() == FACEBOOK_ONLINE ) 
		{
			FB.XFBML.parse(document.getElementById(newSpan.id));
		}

        if ( $('#hidden-resizer').length == 0 )
        {
			var xdiv = document.createElement("div");
			xdiv.id = "hidden-resizer";
			$(xdiv).css("border", "1px solid");
			$(xdiv).css("z-index", "1");
			$(xdiv).css("top", "0");
			$(xdiv).css("left", "0");
			$(xdiv).css("position", "absolute");
			$(xdiv).css("background", "white");
			$(xdiv).css("display", "inline-block");
			$(xdiv).css("visibility", "hidden");
			document.getElementById('wrapper2').appendChild(xdiv);
		}
		
		for (var l=0; l<textList.length; l++)
		{
			if ( browserPointer.isFullScreen() == true)
			{
				var elem = textList[l];
				elem = $(elem);
				var size;
				var newSize;
						   
				var desired_width = elem.width();			  
				var resizer = $('#hidden-resizer');

				resizer.html( elem.html() );	

				resizer.css("font-family", elem.css("font-family") ); 
				resizer.css("font-size", elem.css("font-size") ); 	
				resizer.css("font-weight", elem.css("font-weight") ); 	
				resizer.css("text-shadow", elem.css("text-shadow") ); 	
                                

				var wrap2 = document.getElementById('wrapper2');
				
				var percentage = parseFloat( 940 / $(wrap2).width() );
				
				
                //alert(percentage+","+elem.html() +","+emSize+","+resizer.width()+","+desired_width);
				emSize = false;
				while(resizer.width() > desired_width ) 
				{
					size = parseFloat(resizer.css("font-size"), 10);
					emSize = parseFloat( (percentage*(size / 10))-0.1 ).toFixed(1)+'em';
					resizer.css("font-size", emSize );
					//alert(percentage+","+elem.html() +","+emSize+","+resizer.width()+","+desired_width);
							   
				}
				if (emSize != false)
				{
							  
				  elem.css("font-size", emSize);
		  
				}
				
			}
			
			if ( browserPointer.isFullScreen() == false )
			{	
			   

				var elem = textList[l];
				elem = $(elem);
				var size;
				var newSize;
						   
				var desired_width = elem.width();			  
				var resizer = $('#hidden-resizer');

				resizer.html( elem.html() );	

				resizer.css("font-family", elem.css("font-family") ); 
				resizer.css("font-size", elem.css("font-size") ); 	
				resizer.css("font-weight", elem.css("font-weight") ); 	
				resizer.css("text-shadow", elem.css("text-shadow") ); 	

				resizer.css("top", "0px");
				resizer.css("position", "absolute");

				
				emSize = false;
				while(resizer.width() > desired_width ) 
				{
					size = parseFloat(resizer.css("font-size"), 10);
					emSize = parseFloat( (size / 10)-0.1 ).toFixed(1)+'em';
								   
					resizer.css("font-size", emSize );
								   
					//alert(elem.html() +","+emSize+","+resizer.width()+","+desired_width);               
				}
				if (emSize != false)
				{
							  
				  elem.css("font-size", emSize);
		  
				}
			}
		}
		

		
	}

    //BOTTOMTAB	and TOPTAB
	var tags = teksti.getElementsByTagName("tab");
	for(var i = 0; i < tags.length; i++) 
	{
	    
		var div = document.createElement("div");

		var tag = tags[i];
		var iId = tag.getElementsByTagName("id")[0].firstChild.nodeValue;
		var iType = tag.getElementsByTagName("type")[0].firstChild.nodeValue;

		if ( tag.getElementsByTagName("state")[0] == undefined )
		{
			var iState = "";
		}
		else
		{
			var iState = " " + tag.getElementsByTagName("state")[0].firstChild.nodeValue;
		}
		
		if (iType == "topTab")
		{
			var iClass = "toptab";
			var luokkac = "topTabContainer";
			var luokkat = "topTabText";
		}
		else
		{
			var iClass = "bottomtab";
			var luokkac = "tabContainer";
			var luokkat = "tabText";
		}

		var span = document.createElement("span");
		
		//var iValue = tag.getElementsByTagName("value")[0].firstChild.nodeValue;
		var iValue = gamePointer.getDescription( iId );
		if (iValue == false && iValue != " ")
		{
		  iValue = "%" + iId;
		}
		
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

              kValue = kValue + iValue[k] + "\n";			  
		  
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
			taustat.push( $(div) ); //let's store the tab div
			//$(div).addClass('r640x480');
		}
        
		$(div).addClass("GUIelement");
		
		document.getElementById('wrapper2').appendChild(div);

		if ( iClass == "bottomtab" )
		{
		    
			if ( tag.getElementsByTagName("vector")[0] != undefined && (is_ie11 || is_firefox || is_chrome) ) 
			//css3:n pointer-events toimii vain harvoissa selaimissa
			{
                
				var vec = tag.getElementsByTagName("vector")[0];
				var vecx = vec.getElementsByTagName("x")[0].firstChild.nodeValue;
				var vecy = vec.getElementsByTagName("y")[0].firstChild.nodeValue;
				var vecsize = vec.getElementsByTagName("size")[0].firstChild.nodeValue;
				var scalex = vec.getElementsByTagName("scalex")[0].firstChild.nodeValue;
				var scaley = vec.getElementsByTagName("scaley")[0].firstChild.nodeValue;
				var effect = vec.getElementsByTagName("effect")[0].firstChild.nodeValue;
				var vect = [ iId, vecx, vecy, vecsize, kValue, span, scalex, scaley, effect ];

                console.log( vect );				
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

	    if ( tag.getElementsByTagName("type")[0] == undefined )
		{
			var iType = "";
		}
		else
		{
			var iType = tag.getElementsByTagName("type")[0].firstChild.nodeValue;
		}
		
		if ( tag.getElementsByTagName("state")[0] == undefined )
		{
			var iState = "";
		}
		else
		{
			var iState = " " + tag.getElementsByTagName("state")[0].firstChild.nodeValue;
		}
		
		if ( iType == "normal" ) // tavanomainen painonappi
		{
		
			div.className = "button GUIelement" + iState;

			//var iValue = tag.getElementsByTagName("value")[0].firstChild.nodeValue;
			var alt = "";
			if ( tag.getElementsByTagName("value")[0] != undefined )
			{
			  alt = tag.getElementsByTagName("value")[0].firstChild.nodeValue;
			}
			
			var iValue = gamePointer.getDescription( iId + alt );
			if (iValue == false)
			{
			  iValue = "%" + iId + alt;
			}			
			
			var span = document.createElement("span");
			var text = document.createTextNode(iValue);

			span.appendChild(text);
			span.id = "text"+iId;
			
			span.className = "buttonText";
			div.appendChild(span);			
			
		}
		else // audio- tai fullscreen -switch-nappi
		{
			div.className = "topButton GUIelement" + iState;

		}

		document.getElementById('wrapper2').appendChild(div);
        
		if ( $('#hidden-resizer').length == 0 )
        {
			var xdiv = document.createElement("div");
			xdiv.id = "hidden-resizer";
			$(xdiv).css("border", "1px solid");
			$(xdiv).css("z-index", "1");
			$(xdiv).css("top", "0");
			$(xdiv).css("left", "0");
			$(xdiv).css("position", "absolute");
			$(xdiv).css("background", "white");
			$(xdiv).css("display", "inline-block");
			$(xdiv).css("visibility", "hidden");
			
			document.getElementById('wrapper2').appendChild(xdiv);
		}        
		
		if ( iType == "normal" ) // tavanomainen painonappi
		{
			if ( browserPointer.isFullScreen() == true )
			{	
				var elem = $('#'+iId);
				var span = document.getElementById('text'+iId);
				var size;
				var newSize;
				var desired_width = elem.width()-8; //8px = MARGIN
				var resizer = $('#hidden-resizer');
				resizer.html( text.nodeValue );
				resizer.css("font-family", elem.css("font-family") ); 
				resizer.css("font-size", elem.css("font-size") ); 
				resizer.css("font-weight", elem.css("font-weight") ); 	
				resizer.css("text-shadow", elem.css("text-shadow") ); 	
				var originalHeight = resizer.height();
				
				var wrap2 = document.getElementById('wrapper2');
				
				var percentage = parseFloat( 940 / $(wrap2).width() );
				
								
				emSize = false;
				while(resizer.width() > desired_width ) 
				{
					size = parseFloat(resizer.css("font-size"), 10);
					emSize = parseFloat( (percentage*(size / 10))-0.1 ).toFixed(1)+'em';
					resizer.css("font-size", emSize );
					//alert(elem.html() +","+emSize+","+resizer.width()+","+desired_width);
				}
				var newHeight = resizer.height();
				var emDifferenceHeight = (percentage*((originalHeight - newHeight) / 10)).toFixed(1) + 'em';
				if (emSize != false)
				{
					elem.css("font-size", emSize);
					$(span).css('top', emDifferenceHeight);
				}
			}
		
			if ( browserPointer.isFullScreen() == false )
			{	
				var elem = $('#'+iId);
				var span = document.getElementById('text'+iId);
				var size;
				var newSize;
				var desired_width = elem.width()-8; //8px = MARGIN
				var resizer = $('#hidden-resizer');
				resizer.html( text.nodeValue );
				resizer.css("font-family", elem.css("font-family") ); 
				resizer.css("font-size", elem.css("font-size") ); 
				resizer.css("font-weight", elem.css("font-weight") ); 	
				resizer.css("text-shadow", elem.css("text-shadow") ); 	
				var originalHeight = resizer.height();
				emSize = false;
				while(resizer.width() > desired_width ) 
				{
					size = parseFloat(resizer.css("font-size"), 10);
					emSize = parseFloat( (size / 10)-0.1 ).toFixed(1)+'em';
					resizer.css("font-size", emSize );
				}
				var newHeight = resizer.height();
				var emDifferenceHeight = ((originalHeight - newHeight) / 10).toFixed(1) + 'em';
				if (emSize != false)
				{
					elem.css("font-size", emSize);
					$(span).css('top', emDifferenceHeight);
				}
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
		console.log("i: "+i);
		console.log("textVectors.length: " + textVectors.length);
		console.log("drawVectors1: "+vect);
		console.log("drawVectors2: "+vect[0]+","+vect[4]+","+vect[5]);
		
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
