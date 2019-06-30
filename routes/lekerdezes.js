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
        let plantGrowthArray = [];

        sensorNameArray.push("Temperature [°C]");
        sensorNameArray.push("Humidity [%]");
        sensorNameArray.push("Soil-sensor I");
        sensorNameArray.push("Soil-sensor II");
        sensorNameArray.push("Full light intensity [lux]");
        sensorNameArray.push("IR light intensity [lux]");
        sensorNameArray.push("Visible light intensity [lux]");
        sensorNameArray.push("Mean plant growth [mm^2]");

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

        let plantgrowth_datascheme = mongoose.Schema({
            "Time" : Date,
            "Slot_1" : Number,
            "Slot_2" : Number,
            "Slot_3" : Number,
            "Slot_4" : Number,
            "Slot_5" : Number,
            "Slot_6" : Number,
            "Slot_7" : Number,
            "Slot_8" : Number,
            "Slot_9" : Number,
            "Slot_10" : Number,
            "Slot_11" : Number,
            "Slot_12" : Number
        });

        let Model;
        try {
            Model = mongoose.model('Datamodel');
        } catch (error) {
            Model = mongoose.model('Datamodel',datascheme,'Adatok');
        }

        let Model2;
        try {
            Model2 = mongoose.model('PG_Datamodell');
        } catch (error) {
            Model2 = mongoose.model('PG_Datamodell',plantgrowth_datascheme,'Picture_analyzing');
        }

        var Promise1 = Model.find({Project: req.body.selectedProject},function(err,results){
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
                    //console.log(datablock);
                    //dataArray.push(datablock);
                    if(datablock.Time >= Date.parse(req.body.data_from_date) && datablock.Time <= Date.parse(req.body.data_until_date)){
                        dataArray.push(datablock);
                    }
                    if(!deviceArray.includes(datablock.Device)){
                        deviceArray.push(datablock.Device);
                    }
                });
                //console.log(deviceArray);
                
            }
        });

        var Promise2 = Model2.find({},function(err,results){
            if(err) {
                console.log(err)
                console.log("Lekérdezési hiba történt.");
                mongoose.connection.close();
                } else if (results.length < 1) {
                    console.log("Project has no data...");
                    res.redirect('/lekerdezes');
                } else {
                    results.forEach(function(datablock){
                        if(Date.parse(datablock.Time) >= Date.parse(req.body.data_from_date) && Date.parse(datablock.Time) <= Date.parse(req.body.data_until_date)){
                            plantGrowthArray.push(datablock);
                        }        
                    });
                }

        });

        Promise.all([Promise1, Promise2]).then(function() {
            mongoose.connection.close();
            //console.log(plantGrowthArray);
            plantGrowthArray.sort(function(a, b) {
                a = new Date(a.Time);
                b = new Date(b.Time);
                return a>b ? 1 : a<b ? -1 : 0;
            });
                res.render('Datagraph/datagraph' , { title: 'Internet of Living Things - Smartpot', 'projectName' : req.body.selectedProject, 
                    'dataArray' : dataArray, 'deviceArray' : deviceArray, 'sensorNameArray' : sensorNameArray, 'plantgrowth_data' : plantGrowthArray } );
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
    var pg_data = JSON.parse(req.body.plantgrowth_data);
    //console.log(sensors);

    // Converting the dates back from the dataset to NodeJS date pattern.
    data.forEach(sensorDataSet => {
        sensorDataSet.forEach(dataLine => {
            let date = new Date((dataLine.x)*1000);
            dataLine.x = date;
        });
    });

    //console.log(data);
    //console.log(pg_data);

    // Writing to file begins
    let writeStream = fs.createWriteStream(__dirname+'/../users/'+req.session.user+'/data.txt',{flags: 'w+'});
    let helpCounter = 0;

    let pg_help_startdate = new Date("9999-12-17T03:24:00");
    let pg_help_enddate = new Date(0);

    for (let sensorName in sensors) {
        if (sensors.hasOwnProperty(sensorName)) {
            //console.log(sensorName + " -> " + sensors[sensorName]);
            if(sensors[sensorName] == true) {
                writeStream.write(sensorName+":\n");
                console.log(data[helpCounter]);
                data[helpCounter].forEach(sensorData => {
                    if(pg_help_startdate > sensorData.x) {
                        pg_help_startdate = Date.parse(sensorData.x);
                    }
                    if(pg_help_enddate < sensorData.x) {
                        pg_help_enddate = Date.parse(sensorData.x);
                    }
                    writeStream.write("\t"+sensorData.x+"\t"+sensorData.y+"\n");
                });
                helpCounter++;
            }
        }

    }
    writeStream.end();



    writeStream.on("finish", () => {

        let newwriteStream = fs.createWriteStream(__dirname+'/../users/'+req.session.user+'/data.txt',{flags: 'a+'});
            if(sensors["Plant growth"] == true) {
            newwriteStream.write("Plant growth data by slot:\n");
                pg_data.forEach(pg_datablock => {
                if(Date.parse(pg_datablock.Time) >= pg_help_startdate && Date.parse(pg_datablock.Time) <= pg_help_enddate) {
                    newwriteStream.write(pg_datablock.Time+"\t"+pg_datablock.Slot_1+"\t"+pg_datablock.Slot_2+"\t"+pg_datablock.Slot_3+"\t"+pg_datablock.Slot_4+"\t"+pg_datablock.Slot_5+"\t"+pg_datablock.Slot_6+"\t"+
                        pg_datablock.Slot_7+"\t"+pg_datablock.Slot_8+"\t"+pg_datablock.Slot_9+"\t"+pg_datablock.Slot_10+"\t"+pg_datablock.Slot_11+"\t"+pg_datablock.Slot_12+"\n");
                }
            });
            }
            newwriteStream.end();

            newwriteStream.on("error", (e) => {
                res.send(e);
            });

            newwriteStream.on("finish", () => {
                res.download(__dirname+'/../users/'+req.session.user+'/data.txt');
            });
    });

    writeStream.on("error", (e) => {
        res.send(e);
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