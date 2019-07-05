var subscribeTopic = "";

var Realtime = function() {

	var firstMessage = true;
	
	var clientId="Livegraph_"+Date.now();

	console.log("clientId: " + clientId);
	var hostname = "172.16.0.4";
	var client;

	this.initialize = function(){
		
		client = new Messaging.Client(hostname, 9001, clientId);

		// Valós idejű gráf betöltése
		var rtGraph = new RealtimeGraph();
		client.onMessageArrived = function(msg) {
			var topic = msg.destinationName;
			
			var payload = JSON.parse(msg.payloadString);
			//Első üzenet, gráfindítás 
		    if (firstMessage) {
		    	$('#chart').empty();
		    	firstMessage=false;
				rtGraph.displayChart(null,payload);
				$("#deviceslist").prop( "disabled", true );
				$("#subscribebutton").prop( "disabled", true );
				//Ha adadtot találunk, a gateway rááll, és nem lehet topicót módosítani.
				console.log("Data found. Attaching gateway...");
		    } else {
		    	rtGraph.graphData(payload);
		    }
		};

		client.onConnectionLost = function(e){
			console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
			this.connect(connectOptions);
		}

		var connectOptions = new Object();
		connectOptions.keepAliveInterval = 3600;
		connectOptions.useSSL=false;
		

		connectOptions.onSuccess = function() {
			console.log("MQTT connected to host: "+client.host+" port : "+client.port+" at " + Date.now());
		}

		connectOptions.onFailure = function(e) {
			console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
		}

		console.log("about to connect to " + client.host);
		client.connect(connectOptions);
		
	}

	// Feliratkozás az eszközre, ha az eszköznevet kiválasztották
	this.plotRealtimeGraph = function(){
		var subscribeOptions = {
			qos : 0,
			onSuccess : function() {
				console.log("subscribed to " + subscribeTopic);
			},
			onFailure : function(){
				console.log("Failed to subscribe to " + subscribeTopic);
				console.log("As messages are not available, visualization is not possible");
			}
		};
		
		var item = $("#deviceslist").val();
		var tokens = item.split(':');
		if(subscribeTopic != "") {
			console.log("Unsubscribing to " + subscribeTopic);
			client.unsubscribe(subscribeTopic);
		}

		//előző diagram törlése
		$('#chart').hide(function(){ 
			$('#chart').empty(); 
			$('#chart').show();
			$('#chart').append(imageHTML);
		});
		
		$('#timeline').empty();
		$('#legend').empty();
		firstMessage = true;

		subscribeTopic = $("#deviceslist").val();
		if(subscribeTopic == "") {
			alert("Topic cannot be empty.");
		} else {
			client.subscribe(subscribeTopic,subscribeOptions);
		}
	}

	this.initialize();

	var nulltextHTML = '<div id="errorUzenet" class="iotdashboardtext">Kérem, írjon be egy topic-ot.</div>';
	var imageHTML = '<div class="iotdashboardtext">Currently, there is no incoming data on the selected device.</div><br><div class="iotdashboardtext">Please be patient, or subscribe to another topic.</div> <img class="iotimagesMiddle" align="middle" alt="Chart" src="images/hourglass.svg">';
}
