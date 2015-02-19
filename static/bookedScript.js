var userLatitude;
var userLongitude;
var optionsExpanded=false;
var inExpanded=false;
var gotExpanded=false;
var SCRIPT_ROOT = 'http://127.0.0.1:5000';
var currentSuggestion;
//var SCRIPT_ROOT =  'http://ilw.data.ed.ac.uk/book.ed';

//var suggestion = [];

var suggestion=[{distance:0.0001433252,ratio:0.2345,coordinates:(55.2346,-3.342),capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'}]; //[{roomName:'Library Cafe',latitude:55.942705,longitude:-3.189147,building:'Main Library',capacity:28,current:12, hasComputer:true,hasWhiteboard:true,hasGroupSpace:true, hasPrinter:true,openingHours:'7.30am-2.30am', type:'lab'}]

//var currentSuggestion = suggestion[0];

var requests = {distance:0.0001433252,ratio:0.2345,coordinates:(55.2346,-3.342),capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'}

//{distance:0.0001433252,ratio:0.2345,coordinates:(55.2346,-3.342),capacityComp:'11',freeComp:'3',opening hours:'9-5', group:'busness', location:'busnessloc'}

$(document).ready(function(){
	getLocation();
	
	$('.selectable').click(function(){
		if (!$(this).hasClass('selected')){
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});
	
    $("#yesPls").click(function(){
		// go to booking/maps as required
	});

	$("#nahM8").click(function(){
		//createRequest();
		
        getDetailed();
		
		//displaySuggestion();
	});
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
	$("#privateBtn").click(function(){
		alert('Suggestions of bookable tutorial rooms are not included in the alpha version'); //we'll include them when the timetabling department give us access to their data (hint hint pls)
	});
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
	})
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
});

function deselectIns(){
	$('#libraryBtn').removeClass('selected');
	$('#centralBtn').removeClass('selected');
	$('#kingsBtn').removeClass('selected');
}

function deselectGots(){
	$('#computerBtn').removeClass('selected');
	$('#whiteboardBtn').removeClass('selected');
	$('#groupSpaceBtn').removeClass('selected');
	$('#printerBtn').removeClass('selected');
}

//change the display to show details of the new suggestion{
function displaySuggestion(){
	document.getElementById('map').src= 'https://maps.googleapis.com/maps/api/staticmap?zoom='+calculateZoom()+calculateViewpoint()+'&size=380x330&key=AIzaSyBcrXTgUVxfXVLj3rh5gIUWyYRpveHMmEs&markers=size:medium%7Clabel:A%7C'+userLatitude+','+userLongitude+'&markers=size:medium%7Clabel:B%7C'+ currentSuggestion.latitude+','+ currentSuggestion.longitude;
	$('#buildingName').text(currentSuggestion.building);
	$('#capacityValue').text(currentSuggestion.capacity);
	$('#usageValue').text(currentSuggestion.current);
	if(currentSuggestion.type=='room'){
		$('#capacityLabel').text('Capacity: ');
		$('#usageLabel').text('Current availability: ');
		$('#usageValue').text('Not booked');
	}else{
		$('#capacityLabel').text('Computers: ');
		$('#usageLabel').text('Computers in use: ');
	}
	$('#facilitiesValue').text( '' +  (((currentSuggestion.hasComputer&&currentSuggestion.type=='room'?', Computer':'')+(currentSuggestion.hasPrinter?', Printer':'')+(currentSuggestion.hasWhiteboard?', Whiteboard':'')+(currentSuggestion.hasGroupSpace?', Group Space':'')).slice(2)) );
	if ($('#facilitiesValue').text()===""){
		$('#facilitiesValue').text('None, just a room!')
	}
	$('#openingValue').text(currentSuggestion.openingHours);
	$('#roomName').text(currentSuggestion.roomName);
}
function calculateZoom(){
	var distance = getDistanceFromLatLonInKm(userLatitude,userLongitude,currentSuggestion.latitude,currentSuggestion.longitude);
	if (distance<0.25){
		return 16;
	}else if (distance<0.4){
		return 15;
	}else if (distance<1){
		return 14;
	}
	return 15;
}
function calculateViewpoint(){
	if (getDistanceFromLatLonInKm(userLatitude,userLongitude,currentSuggestion.latitude,currentSuggestion.longitude)>=1){
		return 'center='+currentSuggestion.latitude,currentSuggestion.longitude;
	}
	return '';
}
//change the display to show details of the new suggestion}

function createRequest(){
	var close=($('#closeBtn').hasClass('selected')?1:0);
	var quiet=($('#quietBtn').hasClass('selected')?1:0);
	var private=($('#privateBtn').hasClass('selected')?1:0);
	var late=($('#lateBtn').hasClass('selected')?1:0);
	var computer=($('#computerBtn').hasClass('selected')?1:0);
	var whiteboard=($('#whiteboardBtn').hasClass('selected')?1:0);
	var groupSpace=($('#groupBtn').hasClass('selected')?1:0);
	var printer=($('#printerBtn').hasClass('selected')?1:0);
	var inVar;
	if($('#libraryBtn').hasClass('selected')){
		inVar = 'Main Library';
	}else if($('#centralBtn').hasClass('selected')){
		inVar = 'Central';
	}else if ($('#kingsBtn').hasClass('selected')){
		inVar = 'Kings';
	}else{
		inVar=0;
	}
	requests = {close:close, quiet:quiet, private:private, late:late, in:inVar ,computer:computer, whiteboard:whiteboard, groupSpace:groupSpace, printer:printer};

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
}
// functions to do with getting user location }

// functions to do with calculating distances {
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

// sends cords and waits for data back, which is just success 
function sendUserCords() {
    getLocation()
  $.getJSON(SCRIPT_ROOT + '/user_coordinates', {
        la: userLatitude,
        lo: userLongitude
      }, function(data) {
      suggestion.push(data)
        console.log(data);
      currentSuggestion = suggestion[suggestion.length-1];
      });
}

function getDetailed() {
	getLocation();
    var details = {};
	details.lo = userLongitude;
	details.la = userLatitude;
	details.quiet = quiet=$('#quietBtn').hasClass('selected');
	details.requests=requests;
    details.suggestions = JSON.stringify(suggestion);
	$.getJSON(SCRIPT_ROOT + '/detailed_suggestion', details, function(data) {
		//May need format change etc
		suggestion.push(data)
        console.log(data)
        currentSuggestion = suggestion[suggestion.length-1];
	});
}