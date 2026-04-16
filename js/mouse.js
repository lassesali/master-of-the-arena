/* 
 * Copyright (c) 2014 Lasse Sali. 
 * This project is licensed under the MIT License.
*/

//hiiriolion konstruktori
function Mouse() {
	var lastMouseUpTime = 0;
	var mousePointer = this;

	this.setLastMouseUpTime = function(param) {
		lastMouseUpTime = param;
	}

	this.getLastMouseUpTime = function() {
	  return lastMouseUpTime;
	}

	
/* Tarkistaa onko hiiren napin painallus laukaistu virheellisesti duplikaattina */
	this.isDuplicateMouseEvent = function() {
	  var currentTime = getCurrentTime();
	  var lastMouseUpTime= mousePointer.getLastMouseUpTime();
	  
	  if ( currentTime - lastMouseUpTime > 150 ) {
        mousePointer.setLastMouseUpTime(currentTime);		
		return false;	
	  }
	  else
	  {	 
		mousePointer.setLastMouseUpTime(currentTime);
 	    return true;	
	  }
	  	 
	}

/* Alustaa hiiren */	
	this.init = function( browserObj, gameObj, guiObj ) {

		$("body").on("mouseenter", ".GUIelement", function(){
		  guiObj.mouseenter( $(this), browserObj, mousePointer, gameObj );
		});

		$("body").on("mouseleave", ".GUIelement", function(){
		  guiObj.mouseleave( $(this), browserObj, mousePointer, gameObj );
		});

		$("body").on("mouseup", ".GUIelement", function(event){
		  if (event.which < 2) // only left mouse button
		  {
		    guiObj.mouseup( $(this), browserObj, mousePointer, gameObj );
		  }
		});
		
		$("body").on("mousedown", ".GUIelement", function(event){
		  if (event.which < 2) // only left mouse button
		  {
			guiObj.mousedown( $(this), browserObj, mousePointer, gameObj );
		  }
		});

/*
		$("body").on("touchstart", ".GUIelement", function(event){
			if ( $(this).hasClass("background") ) {
				//alert("touchstart");
			}
		});

		$("body").on("touchleave", ".GUIelement", function(){
			if ( $(this).hasClass("background") ) {
				alert("touchleave");
			}
		});	

		$("body").on("touchend", ".GUIelement", function(event){
			if ( $(this).hasClass("background") ) {
				alert("touchend");
			}
		});		
		*/
	}
		


}

