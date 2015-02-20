var userLatitude; //current latitude of user
var userLongitude; //current longitude of user

var optionsExpanded=false; //whether the options menu is currently expanded
var inExpanded=false; //whether the 'in...' menu is currently expanded
var gotExpanded=false; //whether the 'in...' menu is currently expanded

var currentSuggestion; //the suggestion as returned by the server
var newSuggestion; //the suggestion in the appropriate format for populating the html

var SCRIPT_ROOT = 'http://127.0.0.1:5000'; //the root of the server TODO UPDATE
//var SCRIPT_ROOT =  'http://ilw.data.ed.ac.uk/book.ed';

//dummy currentSuggestion:
var suggestion=[{distance:0.0001433252,ratio:0.2345,coordinates:[55.2346,-3.342],capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'}]; 

//dummy newSuggestion: [{roomName:'Library Cafe',latitude:55.942705,longitude:-3.189147,building:'Main Library',capacity:28,current:12, hasComputer:true,hasWhiteboard:true,hasGroupSpace:true, hasPrinter:true,openingHours:'7.30am-2.30am', type:'lab'}]

//when the page first loads...
$(document).ready(function(){
	//wee hack to get data from index page to main without cookie nonsense
	//if they chose quiet, set up 'quiet' settings
	if (window.name=="quiet"){
		$('#closeBtn').removeClass('selected');
		$('#quietBtn').addClass('selected');
	//otherwise if they chose late, set up 'late' settings
	}else if( window.name=="late"){
		$('#closeBtn').removeClass('selected');
		$('#lateBtn').addClass('selected');
	}//otherwise just keep it as it is, with closeBtn selected
	//clear the data used in the hack
	window.data="";
	//get the user's current coordinates
	//get the suggestion from the server
	//display the suggestion
	getLocation();
    getSuggestion();
	
	//hyperlink to visualisation
	$('#visulisationLogo').click(function(){
		window.location.href='visualisation.html';
	});
	//hyperlink to home
	$('#logo').click(function(){
		window.location.href='/';
	});
	
	//adding ability to toggle selectable elements
	$('.selectable').click(function(){
		if (!$(this).hasClass('selected')){
			$(this).addClass('selected');	
			if((!($(this).attr('id')=='inBtn' ||$(this).attr('id')=='gotBtn'))|| ($(this).attr('id')=='inBtn'&&($('#libraryBtn').hasClass('selected')||$('#centralBtn').hasClass('selected')||$('#kingsBtn').hasClass('selected'))) || ($(this).attr('id')=='gotBtn'&&($('#computerBtn').hasClass('selected')||$('#whiteboardBtn').hasClass('selected')||$('#groupSpaceBtn').hasClass('selected')||$('#printerBtn').hasClass('selected')))){
				$('#goBtn').css({'opacity':1});
				$('#goMask').hide();
			}
		}else{
			$(this).removeClass('selected');
			var isSelected = $('#privateBtn').hasClass('selected')||$('#quietBtn').hasClass('selected')||$('#closeBtn').hasClass('selected')||$('#lateBtn').hasClass('selected')|| ($('#inBtn').hasClass('selected')&&($('#libraryBtn').hasClass('selected')||$('#centralBtn').hasClass('selected')||$('#kingsBtn').hasClass('selected')))|| ($('#gotBtn').hasClass('selected')&&($('#computerBtn').hasClass('selected')||$('#whiteboardBtn').hasClass('selected')||$('#groupSpaceBtn').hasClass('selected')||$('#printerBtn').hasClass('selected')));
			if (!isSelected){
				$('#goBtn').css({'opacity':0.3});
				$('#goMask').show();
			}
		}
	});
	
	//if they are happy with the suggestion,
    $("#yesPls").click(function(){
		// display the walking route there on Google maps
		window.location.href= 'https://www.google.com/maps/preview?saddr='+userLatitude+','+userLongitude+'&daddr='+newSuggestion.latitude+','+newSuggestion.longitude+'&dirflg=w';
	});
	
	//if they want to generate another suggestion,
	$("#nahM8").click(function(){
		//get the user's current coordinates
		//get the suggestion from the server
		//display the suggestion
        getLocation();
        getSuggestion();
	});
	
	//if they want to generate another specific suggestion,
	$("#goBtn").click(function(){
		//get the user's current coordinates
		//get the suggestion from the server
		//display the suggestion
        getLocation();
        getSuggestion();
		window.scrollTo(0,0);
		$('#mooore').click();
	});
	
	//toggle displaying more options
	$('#mooore').click(function(){
		if (!optionsExpanded){
			optionsExpanded=true;
			$('#moreOptions').show();
			$('#mainInterface').height(585+(inExpanded?45:0)+(gotExpanded?45:0));
		}else{
			optionsExpanded=false;
			$('#moreOptions').hide();
			$('#mainInterface').height(350);
		}
		
	});
	
	//if they want to see bookable tutorial rooms, say no
	$("#privateBtn").click(function(){
		alert('Suggestions of bookable tutorial rooms are not included in the alpha version'); 
		//we'll include them when the timetabling department give us access to their data (hint hint pls)
	});
	
	//toggle displaying the 'in...' options
	$('#inBtn').click(function(){
		if(!inExpanded){
			inExpanded=true;
			$('#inDropdown').show();
			$('#mainInterface').height($('#mainInterface').height() + 45);
			$('#inMenu').css({'height':'83px'});
			$('#moreOptions').height($('#moreOptions').height()+45);
		}else{
			inExpanded=false;
			$('#inDropdown').hide();
			$('#mainInterface').height($('#mainInterface').height() - 45);
			$('#inMenu').css({'height':'37px'});
			$('#moreOptions').height($('#moreOptions').height()-45);
		}
	});
	
	//toggle displaying the 'got...' options
	$('#gotBtn').click(function(){
		if(!gotExpanded){
			gotExpanded=true;
			$('#gotDropdown').show();
			$('#mainInterface').height($('#mainInterface').height() + 45);
			$('#moreOptions').height($('#moreOptions').height()+45);
			$('#goBtn').css({'top':45});
			$('#goMask').css({'top':2});
		}else{
			gotExpanded=false;
			$('#gotDropdown').hide();
			$('#mainInterface').height($('#mainInterface').height() - 45);
			$('#moreOptions').height($('#moreOptions').height()-45);
			$('#goBtn').css({'top':0});
			$('#goMask').css({'top':-43});
		}
	});
	
	//On selecting a location, deselect the other locations{
	$('#libraryBtn').click(function(){
		$('#centralBtn').removeClass('selected');
		$('#kingsBtn').removeClass('selected');
	});
	$('#centralBtn').click(function(){
		$('#libraryBtn').removeClass('selected');
		$('#kingsBtn').removeClass('selected');
	});
	$('#kingsBtn').click(function(){
		$('#libraryBtn').removeClass('selected');
		$('#centralBtn').removeClass('selected');
	});
	//On selecting a location, deselect the other locations}
});

//functions to do with populating the display {

//change the display to show details of the new suggestion
function displaySuggestion(){
	//convert from the JSON returned by the server to the JSON needed to populate the display
	newSuggestion = addDetails();
	//update the Google Maps static image using their API
	document.getElementById('map').src= 'https://maps.googleapis.com/maps/api/staticmap?zoom='+calculateZoom()+calculateViewpoint()+'&size=380x330&key=AIzaSyBcrXTgUVxfXVLj3rh5gIUWyYRpveHMmEs&markers=size:medium%7Clabel:A%7C'+userLatitude+','+userLongitude+'&markers=size:medium%7Clabel:B%7C'+ newSuggestion.latitude+','+ newSuggestion.longitude;
	
	//Change the value of each of the parameters displayed to the new suggestion's{
	$('#buildingName').text(newSuggestion.building);
	$('#capacityValue').text(newSuggestion.capacity);
	$('#usageValue').text(newSuggestion.current);
	if(newSuggestion.type=='room'){
		$('#capacityLabel').text('Capacity: ');
		$('#usageLabel').text('Current availability: ');
		$('#usageValue').text('Not booked');
	}else{
		$('#capacityLabel').text('Computers: ');
		$('#usageLabel').text('Computers in use: ');
	}
	$('#facilitiesValue').text( '' +  (((newSuggestion.hasComputer&&newSuggestion.type=='room'?', Computer':'')+(newSuggestion.hasPrinter?', Printer':'')+(newSuggestion.hasWhiteboard?', Whiteboard':'')+(newSuggestion.hasGroupSpace?', Group Space':'')).slice(2)) );
	if ($('#facilitiesValue').text()===""){
		$('#facilitiesValue').text('None, just a room!')
	}
	$('#openingValue').text(newSuggestion.openingHours);
	$('#roomName').text(newSuggestion.roomName);
	//Change the value of each of the parameters displayed to the new suggestion's}
}

//convert from the JSON returned by the server to the JSON needed to populate the display
function addDetails(){
	//copy directly those that you can{
	var newSuggestion = {};
	newSuggestion.latitude = currentSuggestion.coordinates[0];
	newSuggestion.longitude = currentSuggestion.coordinates[1];
	newSuggestion.capacity = currentSuggestion.capacityComp;
	newSuggestion.current = currentSuggestion.capacityComp-currentSuggestion.freeComp;
	newSuggestion.openingHours = currentSuggestion['opening hours'];
	//copy directly those that you can}
	newSuggestion.type='lab';                //for now, all we have data on are computer labs so we know they are all labs...
	newSuggestion.hasComputer='true';        //and they all have computers, so we add them directly
	
	newSuggestion.roomName=currentSuggestion.roomName;
	newSuggestion.building=currentSuggestion.building;
		newSuggestion.hasWhiteboard=currentSuggestion.hasWhiteboard;
		newSuggestion.hasGroupSpace=currentSuggestion.hasGroupSpace;
		newSuggestion.hasPrinter=currentSuggestion.hasPrinter;
		//otherwise, copy the other details from the local database
	
	return newSuggestion;
}

//work out how zoomed out the map needs to be
function calculateZoom(){
	var distance = getDistanceFromLatLonInKm(userLatitude,userLongitude,newSuggestion.latitude,newSuggestion.longitude);
	if (distance<0.25){
		return 16;
	}else if (distance<0.4){
		return 15;
	}else if (distance<1){
		return 14;
	}
	return 15;
}

//if user is so far away from suggested location that the map would need to be massively zoomed out to show the two points,
//just show the suggested location on the map and zoom in on that
function calculateViewpoint(){
	if (getDistanceFromLatLonInKm(userLatitude,userLongitude,newSuggestion.latitude,newSuggestion.longitude)>=1){
		return 'center='+newSuggestion.latitude,newSuggestion.longitude;
	}
	return '';
}

//functions to do with populating the display }

// functions to do with getting user location {
function getLocation() {
	//check that the browser is compatible
    if (navigator.geolocation) {
		//get the user's current coordinates or throw an error if that's not possible
        navigator.geolocation.getCurrentPosition( showPosition,showError );
    }
}
//save the current positions, then get a new suggestion from the server
function showPosition(position) {
    userLatitude = position.coords.latitude;
	userLongitude =  position.coords.longitude;
}
//if impossible to get user's current coordinates, display a relevant error message
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Geolocation required for this app.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
// functions to do with getting user location }

// functions to do with calculating distances {
// blatently stolen from the internet
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}
// functions to do with calculating distances }

//get a suggestion from the server
function getSuggestion() {
	// dummy data TODO DELETE
	//currentSuggestion = {'building': 'Holland House', 'hasGroupSpace': 0, 'ratio': 0.688, 'hasPrinter': 1, 'coordinates': (55.938631, -3.169601), 'roomName': 'MicroLab', 'capacityComp': '32', 'freeComp': '22', 'opening hours': '24hr swipe card', 'group': 'Accommodation Services', 'hasWhiteboard': 0, 'location': 'Accommodation Services Holland House - MicroLab'}
	//create the JSON to send to the server{
    var details = {};
	details.lo = userLongitude;
	details.la = userLatitude;
	details.quiet = ($('#quietBtn').hasClass('selected')?1:0);
	details.close = ($('#closeBtn').hasClass('selected')?1:0);
	details.late = ($('#lateBtn').hasClass('selected')?1:0);
	details.in = ($('#inBtn').hasClass('selected')? ($('#libraryBtn').hasClass('selected')?'library': ($('#centralBtn').hasClass('selected')?'central': ($('#kingsBtn').hasClass('selected')?'kings':0))):0);
	if (($('#gotBtn').hasClass('selected'))){
		details.computer = ($('#computerBtn').hasClass('selected')?1:0);
		details.whiteboard = ($('#whiteboardBtn').hasClass('selected')?1:0);
		details.group = ($('#groupSpaceBtn').hasClass('selected')?1:0);
		details.printer = ($('#printerBtn').hasClass('selected')?1:0);
	}else{
		details.computer=0;
		details.whiteboard=0;
		details.group=0;
		details.printer=0;
	}
	details.suggestions = JSON.stringify(suggestion);
	//create the JSON to send to the server}
	//this JSON will be of the following form:
	//{ lo:float, la:float, quiet:(0|1), close:(0|1), late:(0|1), in:('library'|'central'|'kings'), computer:(0|1), whiteboard:(0|1), group:(0|1), printer:(0|1) }
	//Note that all the (0|1) are essentially boolean, it's just JSON was playing up when using actual booleans earlier.  
	
	//send this to the server, then populate the display once you get a response
	$.getJSON(SCRIPT_ROOT + '/detailed_suggestion', details, function(data) {
		suggestion.push(data)
        console.log(data)
        currentSuggestion = suggestion[suggestion.length-1];
		displaySuggestion();
	});
	//displaySuggestion();//TODO DELETE?
}
