const mqtt = require('mqtt');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://172.16.0.3:27017";

// connect to the message server
const client = mqtt.connect('mqtt://172.16.0.4:1883', {clientId: "data-saver"});


client.on('connect', () => {  
  client.subscribe('#', { qos: 2 });
});

client.on('message', (topic, message) => {  
  //console.log(`Received message: '${message}'`);

  let jsonmessage = JSON.parse(message);

	  MongoClient.connect(url, { useNewUrlParser: true } , function(err, db) {
      if (err) throw err;

      let dbo1 = db.db("SZBK-raspik");
      let dbo2 = db.db("SZBK-adatok");
      
      
      dbo1.collection("Devices").findOne({Device_name: topic}, function(err,deviceresult){
        if(err) throw err;

		if(deviceresult != null) {
		
        if(deviceresult.Associated_project != "") {
            jsonmessage["Project"] = deviceresult.Associated_project;
			jsonmessage["Device"] = deviceresult.Device_name;
            console.log(jsonmessage);

                dbo2.collection("Adatok").insertOne(jsonmessage, function(err, res) {
                if (err) throw err;

                db.close();
                });
        } else {
            db.close();
        }

		} else {
			db.close();
		}
      });

    });

});
