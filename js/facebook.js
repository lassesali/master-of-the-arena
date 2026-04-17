/* 
 * Copyright (c) 2013-2014 Lasse Sali. 
 * This project is licensed under the MIT License.
*/

//FB-kirjautuminen-olion konstruktori

var fbPointer; // added on the 4th of August 2015

function facebookLogin()
{
    var gamePointer;
	var initLoadSDK = false;
    //var fbPointer = this; // this line has stopped working in Facebook login
	fbPointer = this;
    var fullscreen = 0;

    this.passURLFullscreenParameter = function(param) {
      fbPointer.fullscreen = param;
    }

    this.getFullscreenURLParameter = function(param) {
      return fbPointer.fullscreen;
    }


	this.report = function()
{
    alert("gamePointer:" + gamePointer + ",fbPointer:" + fbPointer + ",initLoadSDK:" + initLoadSDK); 
} 
  

    this.getInitLoadSDK = function() {
		return fbPointer.initLoadSDK;
	}
    this.setInitLoadSDK = function(item) {
		fbPointer = item;
	}
	
	
	this.setGamePointer = function(param) {
	  gamePointer = param;
	}
	this.getGamePointer = function() {
	  return gamePointer;
	}
	this.login = function(){
		var access_token = '';
		FB.api('/me', function(response) {
			console.log("Welcome " + response.name + ": Your UID is " + response.id+ " and email is " + response.email);
			console.log("and accessToken is " + access_token);
			var uid = response.id;
			if( uid == 0 ) { 
				alert("Error."); 
			} 
			else 
			{
			    console.log(getAika()+"facebookLogin(): INIT(FB_ONLINE ...)");
				gamePointer.init(FACEBOOK_ONLINE,uid,access_token,response.email,fbPointer.getFullscreenURLParameter()); 
			}
		});
	}

	this.logout = function(){
		console.log("logout() "+getAika());

		if (typeof game == 'undefined') 
		{  
			console.log("logout(): 'game' is undefined "+getAika());
		} 
		else
		{
		  	     console.log("facebookLogin(): game.setLoggedin(OFFLINE)");
                  
			game.setLoggedin(OFFLINE);
		}
	}
	
	this.sizeChangeCallback = function() {
		FB.Canvas.setSize();
	}

	this.loggaa = function(response) {
		if (response.authResponse) {
			console.log("loggaa()");
			var access_token = response.authResponse.accessToken;
			FB.api('/me', function(response) {
			    console.log(getAika()+"facebookLogin(): INIT(FB_ONLINE ...)");
				gamePointer.init(FACEBOOK_ONLINE,response.id,access_token,response.email,fbPointer.getFullscreenURLParameter());
			});
		}
	}

	this.fblogin = function() {

		FB.login(function(response) {
			fbPointer.loggaa(response);
		}, {scope: 'email,user_likes'});  //removed offline_access from the scopes on the 4th of August 2015
	}
	
	this.loadSDK = function() {
		if ( initLoadSDK == false ) 
		{   
		    console.log(getAika()+"loadSDK()");
			initLoadSDK = true;
			// Load the SDK Asynchronously
			(function(d){
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
			}(document));
			
		}
	}
	
}



window.fbAsyncInit = function() {

  FB.Canvas.setSize();

  FB.init({
	appId      : '100127613468952', // App ID
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true  // parse XFBML
	//channelUrl : 'http://proto.masterofarena.com/channel.php'  // custom channel
  });
  // Additional initialization code here
  FB.Event.subscribe('auth.login', function(response) {
     if (response.authResponse) {
       var access_token = response.authResponse.accessToken;
       FB.api('/me', function(response) {
  	     console.log(getAika()+"window.fbAsyncInit: INIT(FB_ONLINE ...)");

         fbLogin.getGamePointer().init(FACEBOOK_ONLINE,response.id,access_token,response.email,fbPointer.getFullscreenURLParameter());

       });
     } else {
     }
  });

  FB.Event.subscribe('auth.logout', function(response) {
	fbLogin.logout();
  });

	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
		// the user is logged in and has authenticated your
		// app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed
		// request, and the time the access token 
		// and signed request each expire
		var uid = response.authResponse.userID;
		var accessToken = response.authResponse.accessToken;

                FB.api('/' + uid, function(user) {
                  //alert(user.name+user.email);
                  var name=user.name;
                  var email=user.email;

	          console.log(getAika()+"The user is logged in and has authenticated your app."+getAika());
      	          console.log(name + ": Your UID is " + uid+ " and email is " + email);
                  console.log("and accessToken is " + accessToken);
  	     console.log("window.fbAsyncInit: INIT(FB_ONLINE ...)");

   		  fbLogin.getGamePointer().init(FACEBOOK_ONLINE,uid,accessToken,email,fbPointer.getFullscreenURLParameter());

                });


		
	  } else if (response.status === 'not_authorized') {
		// the user is logged in to Facebook, 
		// but has not authenticated your app
		console.log(getAika()+"The user is logged in to Facebook but has not authenticated your app."+getAika());
  	     console.log("window.fbAsyncInit: INIT(UNAUTH ...)");

		fbLogin.getGamePointer().init(UNAUTH,0,0,"",fbPointer.getFullscreenURLParameter());
	  } else {
		  // the user isn't logged in to Facebook.
		  
                  console.log(getAika() + "The user isn't logged in to Facebook. " + getAika()); 
                  console.log(getAika() + "response.status is "+response.status + " " + getAika()); 
				  console.log("window.fbAsyncInit: INIT(OFFLINE ...)");
                  
		  fbLogin.getGamePointer().init(OFFLINE,0,0,"",0);
	  }
	 });


	 
};



