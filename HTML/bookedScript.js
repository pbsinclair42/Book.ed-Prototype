var noSuggest = [];
var locations = [];
var notThese = [];
var userLatitude;
var userLongitude;

var currentSuggestion = {roomName:'Library Cafe',latitude:55.942705,longitude:-3.189147,building:'Main Library',computers:28,current:12, hasComputer:false,hasWhiteboard:true,hasGroupSpace:false, hasPrinter:false,openingHours:'7.30am-2.30am'};

$(document).ready(function(){
	getLocation();
    $("#yesPls").click(function(){
		// go to booking/maps as required
	});
	
	$("#nahM8").click(function(){
		displaySuggestion();
		// save current suggestion to 'nosuggest' list, then generate new suggestion
	});
	$("#privateBtn").click(function(){
		// generate bookable room
	});
	$('#quietBtn').click(function(){
		// generate empty room
	});
	$('#closeBtn').click(function(){
		// generate nearby room
		alert(userLatitude +', '+userLongitude);
	});
	$('#groupBtn').click(function(){
		// generate room with group space
	});
	$('#openBtn').click(function(){
		//generate room that's open for the next x hrs
	});
	$('#inBtn').click(function(){
		
	});
});

//change the display to show details of the new suggestion
function displaySuggestion(){
	document.getElementById('map').src= 'https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=400x300&key=AIzaSyBcrXTgUVxfXVLj3rh5gIUWyYRpveHMmEs&markers=size:medium%7Clabel:A%7C'+userLatitude+','+userLongitude+'&markers=size:medium%7Clabel:B%7C'+ currentSuggestion.latitude+','+ currentSuggestion.longitude;
	$('#buildingName').text(currentSuggestion.building);
	$('#capacityValue').text(currentSuggestion.computers);
	$('#usageValue').text(currentSuggestion.current);
	$('#facilitiesValue').text( '' +  (((currentSuggestion.hasComputer?', Computer':'')+(currentSuggestion.hasPrinter?', Printer':'')+(currentSuggestion.hasWhiteboard?', Whiteboard':'')+(currentSuggestion.hasGroupSpace?', Group Space':'')).slice(2)) );
	if ($('#facilitiesValue').text()===""){
		$('#facilitiesValue').text('None, just a room!')
	}
	$('#openingValue').text(currentSuggestion.openingHours);
}

// functions to do with getting user location {
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( showPosition,showError );
    }
}
function showPosition(position) {
    userLatitude = position.coords.latitude;
	userLongitude =  position.coords.longitude;
}
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
	userLatitude=55.9444163;
	userLongitude=-3.1868348;
}
// functions to do with getting user location }