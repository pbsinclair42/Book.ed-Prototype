var userLatitude; //current latitude of user
var userLongitude; //current longitude of user

var optionsExpanded=false; //whether the options menu is currently expanded
var inExpanded=false; //whether the 'in...' menu is currently expanded
var gotExpanded=false; //whether the 'in...' menu is currently expanded

var currentSuggestion; //the suggestion as returned by the server
var newSuggestion; //the suggestion in the appropriate format for populating the html

var SCRIPT_ROOT = 'http://127.0.0.1:5000'; //the root of the server TODO UPDATE
//var SCRIPT_ROOT =  'http://ilw.data.ed.ac.uk/book.ed';

// the information missing from the api data
// all had to be manually entered by hand, so there may be some mistakes still
var detailsDatabase = [
	{id:'Central Alison House', roomName:'Alison House',
	building:'Alison House', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Appleton Tower Foyer - Cafe', roomName:'Foyer Cafe',
	building:'Appleton', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Appleton Tower Level 1 (Mezzanine)', roomName:'Mezzanine labs',
	building:'Alison House', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Teviot House - Cafe', roomName:'Teviot Study',
	building:'Teviot', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:false},
	{id:'Central Hugh Robson Bldg Basement A', roomName:'Basement A',
	building:'Hugh Robson', hasWhiteboard:false,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Central Hugh Robson Bldg Basement B', roomName:'Basement B',
	building:'Hugh Robson', hasWhiteboard:false,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Central Main Library - Cafe', roomName:'Cafe labs',
	building:'Main Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:false},
	{id:'Central Main Library Ground', roomName:'Ground floor',
	building:'Main Library', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Central Main Library Ground - Quick Use', roomName:'Quick use labs',
	building:'Main Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Main Library Level 1', roomName:'Level 1',
	building:'Main Library', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Central Main Library Level 2', roomName:'Level 2',
	building:'Main Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Main Library Level 3', roomName:'Level 3',
	building:'Main Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Central Main Library Level 4', roomName:'Level 4',
	building:'Main Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Business School Business School - HUB RC', roomName:'Hub',
	building:'Business School', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Business School Business School - MBA Suite', roomName:'MBA Suite',
	building:'Business School', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
	{id:'Business School Business School - PG Labs', roomName:'PG Labs',
	building:'Business School', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Business School Business School - Synd Rooms', roomName:'Synd Rooms',
	building:'Business School', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Business School Business School - Teach Lab', roomName:'Synd Rooms',
	building:'Business School', hasWhiteboard:true,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Business School Business School - UG Lab', roomName:'Synd Rooms',
	building:'Business School', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Holyrood and High School Yards High School Yards Lab', roomName:'HSY Labs',
	building:'High School Yards', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Holyrood and High School Yards Moray House Library Ground Floor', roomName:'Ground Floor',
	building:'Moray House Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Holyrood and High School Yards Moray House Library Level 1', roomName:'Level 1',
	building:'Moray House Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Accommodation Services Holland House - MicroLab', roomName:'MicroLab',
	building:'Holland House', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'Accommodation Services Holland House - Study Pods', roomName:'Study Pods',
	building:'Holland House', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
	{id:'KB Labs KB Centre Level 1', roomName:'Level 1',
	building:'KB Centre Library', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:false},
	{id:'KB Labs KB Centre Level 2 - Main', roomName:'Level 2 Main',
	building:'KB Centre Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs KB Centre Level 2 - Side 16 Seat', roomName:'Level 2 Wee Side',
	building:'KB Centre Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs KB Centre Level 2 - Side 25 Seat', roomName:'Level 2 Big Side',
	building:'KB Centre Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs KB Centre Level 3', roomName:'Level 3',
	building:'KB Centre Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs Murray Library Ground - Cafe', roomName:'Cafe Labs',
	building:'Murray Library', hasWhiteboard:false,
	hasGroupSpace:true, hasPrinter:true},
	{id:'KB Labs Murray Library Level 1', roomName:'Level 1',
	building:'Murray Library', hasWhiteboard:false,
	hasGroupSpace:true, hasPrinter:true},
	{id:'KB Labs Murray Library Level 1 - Quick Use', roomName:'Quick use labs',
	building:'Murray Library', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs Murray Library Level 2', roomName:'Level 2',
	building:'Murray Library', hasWhiteboard:false,
	hasGroupSpace:true, hasPrinter:true},
	{id:'KB Labs JCMB - Cafe', roomName:'Cafe labs',
	building:'JCMB', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs JCMB L and T Cluster', roomName:'Room 3210',
	building:'JCMB', hasWhiteboard:false,
	hasGroupSpace:false, hasPrinter:true},
	{id:'KB Labs Darwin L and T Cluster', roomName:'L&T Cluster',
	building:'JCMB', hasWhiteboard:true,
	hasGroupSpace:true, hasPrinter:true},
];

//dummy currentSuggestion:
var suggestion=[{distance:0.0001433252,ratio:0.2345,coordinates:[55.2346,-3.342],capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'}]; 

//dummy newSuggestion: [{roomName:'Library Cafe',latitude:55.942705,longitude:-3.189147,building:'Main Library',capacity:28,current:12, hasComputer:true,hasWhiteboard:true,hasGroupSpace:true, hasPrinter:true,openingHours:'7.30am-2.30am', type:'lab'}]

//when the page first loads...
$(document).ready(function(){
	//get the user's current coordinates
	//get the suggestion from the server
	//display the suggestion
	getLocation();
	
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
		}else{
			$(this).removeClass('selected');
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
	});
	
	//toggle displaying more options
	$('#mooore').click(function(){
		if (!optionsExpanded){
			optionsExpanded=true;
			$('#moreOptions').show();
			$('#mainInterface').height(570+(inExpanded?45:0)+(gotExpanded?45:0));
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
			deselectIns();
		}
	});
	
	//toggle displaying the 'got...' options
	$('#gotBtn').click(function(){
		if(!gotExpanded){
			gotExpanded=true;
			$('#gotDropdown').show();
			$('#mainInterface').height($('#mainInterface').height() + 45);
			$('#moreOptions').height($('#moreOptions').height()+45);
		}else{
			gotExpanded=false;
			$('#gotDropdown').hide();
			$('#mainInterface').height($('#mainInterface').height() - 45);
			$('#moreOptions').height($('#moreOptions').height()-45);
			deselectGots();
		}
	});
	
	//On selecting a location, deselect the other locations{
	$('#libraryBtn').click(function(){
		deselectIns();
		$(this).addClass('selected');
	});
	$('#centralBtn').click(function(){
		deselectIns();
		$(this).addClass('selected');
	});
	$('#kingsBtn').click(function(){
		deselectIns();
		$(this).addClass('selected');
	});
	//On selecting a location, deselect the other locations}
});

//deselect all the 'in...' buttons
function deselectIns(){
	$('#libraryBtn').removeClass('selected');
	$('#centralBtn').removeClass('selected');
	$('#kingsBtn').removeClass('selected');
}

//deselect all the 'got...' buttons
function deselectGots(){
	$('#computerBtn').removeClass('selected');
	$('#whiteboardBtn').removeClass('selected');
	$('#groupSpaceBtn').removeClass('selected');
	$('#printerBtn').removeClass('selected');
}

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
	
	//search the local database for the room matching the one sent by the server
	fromDatabase=$.grep(detailsDatabase,function(e){ return e.id==currentSuggestion.location});
	//if you didn't find it, throw an error
	if(fromDatabase.length==0){
		alert('location not found: ' + currentSuggestion.location);
		newSuggestion.roomName='?';
		newSuggestion.building='?';
		newSuggestion.hasWhiteboard='?';
		newSuggestion.hasGroupSpace='?';
		newSuggestion.hasPrinter='?';
	}else{
		//otherwise, copy the other details from the local database{
		newSuggestion.roomName=fromDatabase[0].roomName;
		newSuggestion.building=fromDatabase[0].building;
		newSuggestion.hasWhiteboard=fromDatabase[0].hasWhiteboard;
		newSuggestion.hasGroupSpace=fromDatabase[0].hasGroupSpace;
		newSuggestion.hasPrinter=fromDatabase[0].hasPrinter;
		//otherwise, copy the other details from the local database}
	}
	
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
	getSuggestion();
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
	//dummy data TODO DELETE
	currentSuggestion = {'distance': 0.003695571674313784, 'ratio': 1.0, 'coordinates': [55.948268, -3.183565], 'capacityComp': 27, 'freeComp': '27', 'opening hours': '24hr swipe card', 'group': 'Holyrood and High School Yards', 'location': 'Holyrood and High School Yards Moray House Library Level 1'};
	//create the JSON to send to the server{
    var details = {};
	details.lo = userLongitude;
	details.la = userLatitude;
	details.quiet = ($('#quietBtn').hasClass('selected')?1:0);
	details.close = ($('#closeBtn').hasClass('selected')?1:0);
    details.suggestions = JSON.stringify(suggestion);
	//create the JSON to send to the server}
	//send this to the server, then populate the display once you get a response
	$.getJSON(SCRIPT_ROOT + '/detailed_suggestion', details, function(data) {
		suggestion.push(data)
        console.log(data)
        currentSuggestion = suggestion[suggestion.length-1];
		displaySuggestion();
	});
	displaySuggestion();//TODO DELETE?
}
