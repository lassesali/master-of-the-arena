/* 
 * Copyright (c) 2013-2026 Lasse Sali. 
 * This project is licensed under the MIT License.
*/

/* Graafisen k ytt liittym n Tapahtumank sittelij -olio */
function GUIBehavior() {

var pointer = this;
var browserPointer;
var xmlFile;

$.ajax({                                     
	url: 'GuiBehaviour.xml',                          
	data: '',                        
	dataType: 'xml',                //data format      
	success: function(data)         //on receive of reply
	{
		xmlFile = data;
	} 
}); 


this.setBrowser = function( selainObj )
{
  pointer.browserPointer = selainObj;
}


this.goToScreenState = function(ScreenState,gameObj)
{
	gameObj.setScreenState( pointer.getScreenState(ScreenState), true );
	
}
this.fbLogin = function()
{
	fbLogin.fblogin();
}
this.googleLogin = function()
{
	googleLogin(pointer.browserPointer);
}

this.notify = function(message)
{
	console.log(message);
	$('#textNotification').html(message);
	$('#textNotification').fadeIn(400).delay(2000).fadeOut(400);
}

/* 2026 */	
this.regularLogin = function()
{
	// NOTE: You must ensure the IDs below match the IDs defined in your GUI XML files
	// for the email and password input elements.
	var email = $('#inputUserName input').val(); 
	var password = $('#inputPassword input').val();
	var sessionid = game.sessionid; // Using global 'game' object

	if (email == "" || password == "") {
		pointer.notify("Please enter both email and password.");
		return;
	}

	$.ajax({                                     
		type: 'POST',
		url: 'regular_login.php',                          
		data: {
			email: email,
			password: password,
			session: sessionid
		},                        
		dataType: 'json',                     
		success: function(data)          
		{
			// --- CHANGED: Check data.status and save data.firstname ---
			if (data.status == 1) {
				console.log("Regular login successful!");
				playerFirstName = data.firstname; // Save the name globally!
				game.initState(REGULAR_ONLINE, pointer.browserPointer.isFullScreen()); // Using global 'game' object
			} else {
				pointer.notify("Login failed: <br>" + data.message);
			}
		} 
	});
}

/* 2026 */
this.regularRegister = function()
{
	// Grab the text from the actual input fields, not the text labels
	var username = $('#inputUserName input').val(); 
	var password = $('#inputPassword input').val();

	if (username == "" || password == "") {
		pointer.notify("Please enter both a username/email and a password to register.");
		return;
	}

	$.ajax({                                     
		type: 'POST',
		url: 'register.php',    // This points to the registration script we created earlier                      
		data: {
			email: username,
			firstname: username, // Since your UI only has one username field, we'll use it for both email and firstname
			password: password
		},                        
		dataType: 'json',                     
		success: function(response)          
		{
			if (response.status === "success") {
				pointer.notify("Registration successful! Logging you in...<br>" + response.message);
				// Auto-login the user immediately after successful registration
				pointer.regularLogin();
			} else {
				pointer.notify("Registration failed: <br>" + response.message);
			}
		},
		error: function() 
		{
			pointer.notify("An error occurred communicating with the server.");
		}
	});
}
		
this.getScreenState = function(ScreenState)
{
	var State;
	switch(ScreenState)
	{
		case "MainScreen":
			State = MAIN_SCREEN;
			break;
		case "ManagersOffice":
			State = MANAGERS_OFFICE;
			break;
		case "UserWelcome":
			State = USER_WELCOME;
			break;
		case "UserLogin":
			State = USER_LOGIN;
			break;
		default:
			return false;
	}
	return State;
}

/* P ivitet  n taustakuva */
this.updateBackground = function(gameObj)
{
	var state = gameObj.getScreenState();

	switch(state)
	{
		case MAIN_SCREEN:
			$('#wrapper2').css("backgroundImage", 'url(gui/demoGUI02' + resolution + '.png)'); 
			break;
		case MANAGERS_OFFICE:
			$('#wrapper2').css("backgroundImage", 'url(gui/demoGUI02' + resolution + '.png)'); 
			break;
		default:
			$('#wrapper2').css("backgroundImage", '');
			break;
	}

}


/* Hiirenosoitin menee jonkin objektin p  lle */
this.mouseenter = function(obj,browserObj,mouseObj,gameObj) 
{

   	// Hiirenosoitin menee tabin p  lle
	if ( $(obj).hasClass("bottomtab") )
	{
		browserObj.playAudio("FXbottomtabswap");
		var tabId = $(obj).attr('id');
		switch(tabId)
		{
			case "tabBottom01":
				$(obj).addClass('mouseenter');
				break;
			case "tabBottom02":
				$(obj).addClass('mouseenter');
				break;
			case "tabBottom03":
				$(obj).addClass('mouseenter');
				break;
			case "tabBottomManagersOffice":
				if (gameObj.getScreenState() != MANAGERS_OFFICE) 
				{
					$(obj).addClass('mouseenter');
				}		 
				break;
			case "tabBottom05":
				$(obj).addClass('mouseenter');
				break;
			case "tabBottom06":
				$(obj).addClass('mouseenter');
				break;
			case "tabBottom07":
				$(obj).addClass('mouseenter');
				break;
		}
		
		//DEBUG
	    $("#debugbox").html( "ID:" + $(obj).attr('id') + ", Class:" + $(obj).attr('class') + ", W:" + 
		$(obj).width() + ", H:" + $(obj).height() + ", bg-img:" + $(obj).css('background-image'));
		

	}

	if ( $(obj).hasClass("topButton") )
	{
		browserObj.playAudio("FXclick");
		$(obj).addClass('mouseenter');
	}
	
	if ( $(obj).hasClass("button") && !$(obj).hasClass("disabled") )
	{
        browserObj.playAudio("FXclick");
		var buttonId = $(obj).attr('id');
		if(buttonId != "buttonConfirmDesign") {
		  $(obj).addClass('mouseenter');
		} else {
		  $(obj).addClass('mouseenter');
		}
	}

	if ( $(obj).hasClass("background") )
	{
		//DEBUG
		$("#debugbox").html( "ID:" + $(obj).attr('id') + ", Class:" + $(obj).attr('class') + ", W:" + $(obj).width() + ", H:" + 
		$(obj).height() + ", bg-img:" + $(obj).css('background-image'));
		/*
		if (browserObj.isFullScreen() == true) {
			alert( "ID:" + $(obj).attr('id') + ", Class:" + $(obj).attr('class') + ", W:" + 
			$(obj).width() + ", H:" + $(obj).height() + ", bg-img:" + $(obj).css('background-image') );
		}
		*/
	}
	
} //end of mouseenter()


/* Hiirenosoitin l htee pois jonkin objektin p  lt  */
this.mouseleave = function(obj,browserObj,mouseObj,gameObj) 
{
    
	var iId = $(obj).attr('id');
	
	$('Condition',xmlFile).each(function() 
	{
	  
	  var Mouse = $(this).attr("Mouse");

	  if ( Mouse == "Leave" )
	  {
		$(this).children("Condition").each(function() {
		
		  var HasClass = $(this).attr("HasClass");
		  var DoesNotHaveClass = $(this).attr("DoesNotHaveClass");
		  
		  var result=true;
		  if ( HasClass != undefined )
		  {
		    if  ( !$(obj).hasClass( HasClass ) )
			{
			   result = false;
			}
		  }
		  else
		  {
		    result = false;
		  }
		  if ( DoesNotHaveClass != undefined )
		  {
		    if  ( $(obj).hasClass( DoesNotHaveClass ) )
			{
			   result = false;
			}
		  }
		  

		  if ( result == true )
		  {
  
		  
			if ( HasClass != undefined )
			{
			    
				pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
				
				$(this).children("Condition").each(function() 
				{  
					var HasId = $(this).attr("HasId"); //esim. buttonClose, buttonLoginWithGoogle
					var HasClass = $(this).attr("HasClass");

					if ( HasId == iId )
					{
						$(this).children("Condition").each(function() 
						{  
							var ScreenState = $(this).attr("ScreenState");

							if ( ScreenState != undefined )
							{
								var State = pointer.getScreenState(ScreenState);

								if (gameObj.getScreenState() != State) 
									$(this).children("Else").each(function() {
										pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
									});
							}
						});
					}
					else if ( HasClass != undefined )
					{
						var HasClass = $(this).attr("HasClass");

						if ( $(obj).hasClass( HasClass ) )
						{

							pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
						}
					}
					else
					{
						$(this).children("Else").each(function() {

							pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );						
						});					
					}
					
				});
				
            }
		  }
		});
	  }
	});

} //end of mouseleave()


/* Hiiren nappi nousee yl s jonkin objektin p  ll  */
this.mouseup = function(obj,browserObj,mouseObj,gameObj) 
{
	var test = mouseObj.isDuplicateMouseEvent();
	if ( test == true ) { return false; }
    var iId = $(obj).attr('id');
	
	$('Condition',xmlFile).each(function() 
	{
	  
	  var Mouse = $(this).attr("Mouse");
	  
	  if (Mouse == "Up")
	  {
	    
		$(this).children("Condition").each(function() {
		
		  var HasClass = $(this).attr("HasClass");
		  var DoesNotHaveClass = $(this).attr("DoesNotHaveClass");
		  
		  var result=true;
		  if ( HasClass != undefined )
		  {
		    if  ( !$(obj).hasClass( HasClass ) )
			{
			   result = false;
			}
		  }
		  else
		  {
		    result = false;
		  }
		  if ( DoesNotHaveClass != undefined )
		  {
		    if  ( $(obj).hasClass( DoesNotHaveClass ) )
			{
			   result = false;
			}
		  }
		  

		  if ( result == true )
		  {
  
			pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
			
			$(this).children("Condition").each(function() {
			  var HasClass = $(this).attr("HasClass"); //esim. mouseenter, mousedown
              var HasId = $(this).attr("HasId"); //esim. buttonClose, buttonLoginWithGoogle
			  
              if ( HasClass != undefined )
              {
			    
				pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
				
				$(this).children("Condition").each(function() {
				  var HasId = $(this).attr("HasId"); //esim. buttonAudioSwitch
				  
				  if ( iId == HasId )
				  {
				      pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );

					  $(this).children("Condition").each(function() {				  
						var IsTrue = $(this).attr("IsTrue");		
						var Object = $(this).attr("Object");
						
						if ( Object == "Browser" && IsTrue != undefined )
						{
							if ( browserObj[IsTrue]() == true ) // esim. browserObj.isAudioEnabled()
							{
								pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
							}
							else
							{
								$(this).children("Else").each(function() {
									pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );						
								});
							}
						}
						
					  });
				   }	  
				});
				
				
				
				
              }
			  else if ( HasId != undefined )
			  {
			    if ( iId == HasId )
				{
					
					pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj, browserObj );
					
					$(this).children("Condition").each(function() 
					{  
						var ScreenState = $(this).attr("ScreenState");
						var IsTrue = $(this).attr("IsTrue");
						var Object = $(this).attr("Object");

						if ( ScreenState != undefined )
						{
							var State = pointer.getScreenState(ScreenState);

							if (gameObj.getScreenState() == State) 
							{
								pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
							}
							else
							{
								$(this).children("Else").each(function() {
									pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
								});
							}

						} 
					  else if ( IsTrue != undefined && Object != undefined )
					  {

							if ( Object == "Browser" )
							{
							    
							    console.log ( getAika()+"Dynamic function call: if browserObj."+IsTrue+"() == true" );

								if ( browserObj[IsTrue]() == true )
								{
                                    pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );
								}
								else
								{
									$(this).children("Else").each(function() 
									{
                                      pointer.doAction( $(this).children("Action") , $(obj), gameObj, browserObj );									
								    });
							    }
					        }
					  }
					});
					

					
				} // if ( iId == HasId )
			    	
			  
			  }
			  
			});
			
			
		  
		  }
		
		});
	  /*
		  $(this).find("AddGUI").each(function() {
			var Name = $(this).attr("Name");
			guiList.push(Name);
		  });
		  */
	  }
	  
	});	
	
	
	if ( $(obj).hasClass("bottomtab") )
	{

		var iId = $(obj).attr('id');
		
		//DEBUG
		if ( iId == "tabBottom06" )
		{
			var description = gameObj.getScreenState();
			description = "window: (" + $(window).width() + "," + 
			$(window).height() + ") , document: (" + $(document).width() + "," + 
			$(document).height() + "), wrapper: (" + $('div#wrapper').width() + "," +
			$('div#wrapper').height() + "), wrapper2: (" + $('div#wrapper2').width() + "," +
			$('div#wrapper2').height() + "), wrapper (margin-left, left): (" + $('div#wrapper').css("margin-left") + "," + $('div#wrapper').css("left")
			+ "), wrapper2 (margin-left, left): (" + $('div#wrapper2').css("margin-left") + "," 
			+ $('div#wrapper2').css("left") + "), innerWidth: (" + window.innerWidth + "), innerHeight: (" + window.innerHeight + ") top.frames.length: ("+top.frames.length+")"
			+ ", is_firefox = " + is_firefox + ", is_opera = " + is_opera + ", is_safari = " + is_safari + ", is_chrome = " + is_chrome + ", is_ie11 = " + is_ie11;
			// console.log("is_firefox = " + is_firefox + "is_opera = " + is_opera + "is_safari = " + is_safari + "is_chrome = " + is_chrome + " top.frames.length = " + top.frames.length + " " + getAika()  );
			alert(description);	
		}
		
	}
}

/* Hiiren nappi laskeutuu alas jonkin objektin p  ll  */
this.mousedown = function(obj,browserObj,mouseObj,gameObj) 
{
	if ( $(obj).hasClass("button") && !$(obj).hasClass("disabled") )
	{
		$(obj).addClass('mousedown');
	} 
	else if ( $(obj).hasClass("topButton") )
	{
		$(obj).addClass('mousedown');
	}
}

this.doAction = function(param,obj,gameObj,browserObj)
{
	$(param).each(function() 
	{	
		var Do = $(this).attr("Do");
		var Item = $(this).attr("Item");
		var Object = $(this).attr("Object");
        //console.log(Do+","+Item+","+Object);
		if ( Object == undefined && Do != undefined )
		{
		  obj[Do](Item);   //esim. $(obj).removeClass("mouseenter")
		  console.log("Dynamic function call: $(obj)." + Do + "(" +Item+  ")"   );
		} 
		else if ( Object == "GUIBehaviour" )
		{
		  if ( Item != undefined )
		  {	
			pointer[Do](Item, gameObj);
			console.log("Dynamic function call: pointer." + Do + "(" +Item+  ")"   );						  
		  }
		  else
		  {
			pointer[Do]();
			console.log("Dynamic function call: pointer." + Do + "()"   );	
		  }
		}		
		else if ( Object == "Browser" )
		{
		  if ( Item == undefined )
		  {
			browserObj[Do]();
			console.log("Dynamic function call: $browserObj." + Do + "()"   );
		  }
		  else
		  {
			browserObj[Do](Item);
			console.log("Dynamic function call: $browserObj." + Do + "(" +Item+  ")"   );
		  }
		}			
								
	});
  
}


}