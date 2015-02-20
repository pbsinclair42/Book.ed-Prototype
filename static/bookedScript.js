var userLatitude;
var userLongitude;
var optionsExpanded=false;
var inExpanded=false;
var gotExpanded=false;
var SCRIPT_ROOT = 'http://127.0.0.1:5000';
var currentSuggestion;
var newSuggestion;
//var SCRIPT_ROOT =  'http://ilw.data.ed.ac.uk/book.ed';
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

var suggestion=[{distance:0.0001433252,ratio:0.2345,coordinates:[55.2346,-3.342],capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'}]; //[{roomName:'Library Cafe',latitude:55.942705,longitude:-3.189147,building:'Main Library',capacity:28,current:12, hasComputer:true,hasWhiteboard:true,hasGroupSpace:true, hasPrinter:true,openingHours:'7.30am-2.30am', type:'lab'}]

var requests = {distance:0.0001433252,ratio:0.2345,coordinates:[55.2346,-3.342],capacityComp:'11',freeComp:'3',openingHours:'9-5', group:'busness', location:'busnessloc'};

//{distance:0.0001433252,ratio:0.2345,coordinates:(55.2346,-3.342),capacityComp:'11',freeComp:'3',opening hours:'9-5', group:'busness', location:'busnessloc'}

$(document).ready(function(){
	getLocation();
	
    getDetailed();
	displaySuggestion();
	
	$('#visulisationLogo').click(function(){
		window.location.href='visualisation.html';
	});
	$('#logo').click(function(){
		window.location.href='/';
	});
	
	$('.selectable').click(function(){
		if (!$(this).hasClass('selected')){
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});
	
    $("#yesPls").click(function(){
		// go to booking/maps as required
		console.log($('#quietBtn').hasClass('selected')?1:0);
	});

	$("#nahM8").click(function(){
        getDetailed();
		displaySuggestion();
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
	});
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
	newSuggestion = addDetails();
	document.getElementById('map').src= 'https://maps.googleapis.com/maps/api/staticmap?zoom='+calculateZoom()+calculateViewpoint()+'&size=380x330&key=AIzaSyBcrXTgUVxfXVLj3rh5gIUWyYRpveHMmEs&markers=size:medium%7Clabel:A%7C'+userLatitude+','+userLongitude+'&markers=size:medium%7Clabel:B%7C'+ newSuggestion.latitude+','+ newSuggestion.longitude;
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
}

function addDetails(){
	var newSuggestion = {};
	newSuggestion.latitude = currentSuggestion.coordinates[0];
	newSuggestion.longitude = currentSuggestion.coordinates[1];
	newSuggestion.capacity = currentSuggestion.capacityComp;
	newSuggestion.current = currentSuggestion.capacityComp-currentSuggestion.freeComp;
	newSuggestion.openingHours = currentSuggestion.openingHours;
	newSuggestion.type='lab';
	newSuggestion.hasComputer='true';
	fromDatabase=$.grep(detailsDatabase,function(e){ return e.id==currentSuggestion.location});
	if(fromDatabase.length==0){
		alert('location not found: ' + currentSuggestion.location);
		newSuggestion.roomName='?';
		newSuggestion.building='?';
		newSuggestion.hasWhiteboard='?';
		newSuggestion.hasGroupSpace='?';
		newSuggestion.hasPrinter='?';
	}else{
		newSuggestion.roomName=fromDatabase[0].roomName;
		newSuggestion.building=fromDatabase[0].building;
		newSuggestion.hasWhiteboard=fromDatabase[0].hasWhiteboard;
		newSuggestion.hasGroupSpace=fromDatabase[0].hasGroupSpace;
		newSuggestion.hasPrinter=fromDatabase[0].hasPrinter;
	}
	return newSuggestion;
}

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
function calculateViewpoint(){
	if (getDistanceFromLatLonInKm(userLatitude,userLongitude,newSuggestion.latitude,newSuggestion.longitude)>=1){
		return 'center='+newSuggestion.latitude,newSuggestion.longitude;
	}
	return '';
}
//change the display to show details of the new suggestion}

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
var i=0;//TODO REMOVE TESTING ONLY
function getDetailed() {
	currentSuggestion = {'distance': 0.003695571674313784, 'ratio': 1.0, 'coordinates': [55.948268, -3.183565], 'capacityComp': 27+i, 'freeComp': '27', 'opening hours': '24hr swipe card', 'group': 'Holyrood and High School Yards', 'location': 'Holyrood and High School Yards Moray House Library Level 1'};
	i++;
	getLocation();
    var details = {};
	details.lo = userLongitude;
	details.la = userLatitude;
	details.quiet = ($('#quietBtn').hasClass('selected')?1:0);
	details.close = ($('#closeBtn').hasClass('selected')?1:0);
	//details.requests=requests;
    details.suggestions = JSON.stringify(suggestion);
	$.getJSON(SCRIPT_ROOT + '/detailed_suggestion', details, function(data) {
		//May need format change etc
		suggestion.push(data)
        console.log(data)
        currentSuggestion = suggestion[suggestion.length-1];
	});
}
