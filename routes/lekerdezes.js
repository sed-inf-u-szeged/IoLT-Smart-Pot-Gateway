var express = require('express');
var router = express.Router();

const fs = require('fs');

const mongoose = require('mongoose');

router.get('/', function(req, res) {
	req.session.reload(function(err) {
	if(req.session.isAuthorized == true) {

		var projects_array = [];

        

        mongoose.connect("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });
        
        let projektsema = mongoose.Schema({
        Name : String,
        Owner : Array,
        Raspberries : Array,
        Info : String,
        Start_date : Date,
        End_date : Date,
        isStarted : Boolean,
        isOver : Boolean
        });
        let Model;
        try {
            Model = mongoose.model('Projektmodell');
        } catch (error) {
            Model = mongoose.model('Projektmodell',projektsema,'Projects');
        }

        Model.find({},function(err,results){
            //Hibakezelés
            if(err) {
            console.log(err)
            console.log("Lekérdezési hiba történt.");
            mongoose.connection.close();
            } else if (results.length < 1) {
                console.log("A 'Projects' adatbázis üres..");
                mongoose.connection.close();
            } else {
                results.forEach(function(record){
                    
                    if (req.session.role == "admin"){
                        projects_array.push(record);
                    } else {
                        let ownerArray = [];
                        if(typeof record.Owner == 'string') {
                            ownerArray.push(record.Owner);
                        } else {
                            ownerArray = Object.values(record.Owner);
                        }
                        if (ownerArray.includes(req.session.user)) {
                                projects_array.push(record);
                            }
                    }
                    
                });
                mongoose.connection.close();
            }
        }).then(function(){
            projects_array.sort(projekt_sort);
            res.render('lekerdezes', { title: 'Internet of Living Things - Smartpot' , 'projects_array': projects_array });
		});
		
	} else {
		res.status(200).send("Your session has timed out. Please, login again.");
	}	
})
});

router.post('/data_query', function(req, res) {
	req.session.reload(function(err) {
	if(req.session.isAuthorized == true) {
        console.log(Date.parse(req.body.data_from_date));
        console.log(Date.parse(req.body.data_until_date));

        mongoose.connect("mongodb://172.16.0.3:27017/SZBK-adatok", { useNewUrlParser: true });
        let dataArray = [];
        let deviceArray = [];
        let sensorNameArray = [];

        sensorNameArray.push("Temperature [°C]");
        sensorNameArray.push("Humidity [%]");
        sensorNameArray.push("Soil-sensor I");
        sensorNameArray.push("Soil-sensor II");
        sensorNameArray.push("Full light intensity [lux]");
        sensorNameArray.push("IR light intensity [lux]");
        sensorNameArray.push("Visible light intensity [lux]");

        let datascheme = mongoose.Schema({
            Project : String,
            Device: String,
            Time : Date,
            "Temperature [°C]" : Number,
            "Humidity [%]" : Number,
            "Soil-sensor I" : Number,
            "Soil-sensor II" : Number,
            "Full light intensity [lux]" : Number,
            "IR light intensity [lux]" : Number,
            "Visible light intensity [lux]" : Number
        });

        let Model;
        try {
            Model = mongoose.model('Datamodel');
        } catch (error) {
            Model = mongoose.model('Datamodel',datascheme,'Adatok');
        }

        Model.find({Project: req.body.selectedProject},function(err,results){
            //Hibakezelés
            if(err) {
            console.log(err)
            console.log("Lekérdezési hiba történt.");
            mongoose.connection.close();
            } else if (results.length < 1) {
                console.log("Project has no data...");
                res.redirect('/lekerdezes');
            } else {
                results.forEach(function(datablock){
                    console.log(datablock);
                    //dataArray.push(datablock);
                    if(datablock.Time >= Date.parse(req.body.data_from_date) && datablock.Time <= Date.parse(req.body.data_until_date)){
                        dataArray.push(datablock);
                    }
                    if(!deviceArray.includes(datablock.Device)){
                        deviceArray.push(datablock.Device);
                    }
                });
                console.log(deviceArray);
                mongoose.connection.close();
                res.render('Datagraph/datagraph' , { title: 'Internet of Living Things - Smartpot', 'projectName' : req.body.selectedProject, 
                    'dataArray' : dataArray, 'deviceArray' : deviceArray, 'sensorNameArray' : sensorNameArray } );
            }
        });



    } else {
		res.status(200).send("Your session has timed out. Please, login again.");
	}
    });
});


router.post("/downloadDataInFile", function(req,res){
    req.session.reload(function(err) {

    var data = JSON.parse(req.body.dataArray);
    var sensors = JSON.parse(req.body.sensorArray);
    console.log(sensors);

    // Converting the dates back from the dataset to NodeJS date pattern.
    data.forEach(sensorDataSet => {
        sensorDataSet.forEach(dataLine => {
            let date = new Date((dataLine.x)*1000);
            dataLine.x = date;
        });
    });

    // Writing to file begins
    let writeStream = fs.createWriteStream(__dirname+'/../users/'+req.session.user+'/data.txt',{flags: 'w+'});
    let helpCounter = 0;

    for (let sensorName in sensors) {
        if (sensors.hasOwnProperty(sensorName)) {
            console.log(sensorName + " -> " + sensors[sensorName]);
            if(sensors[sensorName] == true){
                writeStream.write(sensorName+":\n");
                data[helpCounter].forEach(sensorData => {
                    writeStream.write("\t"+sensorData.x+"\t"+sensorData.y+"\n");
                });
                helpCounter++;
            }
        }
    }
    writeStream.end();

    writeStream.on("finish", () => {
        res.download(__dirname+'/../users/'+req.session.user+'/data.txt');
    });
    
    
    });
});



function projekt_sort(a,b){
    if (a.Name < b.Name)
      return -1;
    if (a.Name > b.Name)
      return 1;
    return 0;
  }

module.exports = router;