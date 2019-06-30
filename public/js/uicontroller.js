var realtime = new Realtime();
var indexszam = document.URL.indexOf("/");
var link = document.URL.slice(0,indexszam);



$( "#subscribebutton" ).click(function() {
		realtime.plotRealtimeGraph();
});

$('#adatok_lekerdezese_gomb').click(function() {
	window.location.href = link+"lekerdezes";
});

$('#plant_growth_gomb').click(function() {
	window.location.href = link+"plant_growth";
});

$('#projektek_gomb').click(function() {
	window.location.href = link+"projektek";
});

$('#raspberries_button').click(function() {
	window.location.href = link+"raspberries";
});

$('#logout_button').click(function() {
	window.location.href = link+"logout";
});

$('#create_device_button').click(function() {
	window.location.href = link+"create_device";
});

$('#create_project_button').click(function() {
	window.location.href = link+"create_project";
});

$('#modify_project_button').click(function() {
	window.location.href = link+"modify_project";
});


$('button').click(function() {
	$('button').prop('disabled',true);
});