var express = require('express');
var router = express.Router();

const fs = require('fs');

const mongoose = require('mongoose');

router.get('/', function(req, res) {
	req.session.reload(function(err) {
	if(req.session.isAuthorized == true) {
        res.render('plant_growth', { title: 'Internet of Living Things - Smartpot' });
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

        let plant_growth_data_array = [];
        let slot_array = [];

        for (let i = 1; i <= 12; i++) {
            slot_array.push("Slot_"+String(i));
        }

        mongoose.connect("mongodb://172.16.0.3:27017/SZBK-adatok", { useNewUrlParser: true });
        
        let plant_growth_data_schema = mongoose.Schema({
            Time : Date,
            Slot_1 : Number,
            Slot_2 : Number,
            Slot_3 : Number,
            Slot_4 : Number,
            Slot_5 : Number,
            Slot_6 : Number,
            Slot_7 : Number,
            Slot_8 : Number,
            Slot_9 : Number,
            Slot_10 : Number,
            Slot_11 : Number,
            Slot_12 : Number
            });
            let Model;
            try {
                Model = mongoose.model('Plant_growth_model');
            } catch (error) {
                Model = mongoose.model('Plant_growth_model',plant_growth_data_schema,'Picture_analyzing');
            }

            Model.find({},function(err,results){
                //Hibakezelés
                if(err) {
                console.log(err)
                console.log("Lekérdezési hiba történt.");
                mongoose.connection.close();
                } else if (results.length < 1) {
                    console.log("A 'Picture_analyzing' adatbázis üres..");
                    mongoose.connection.close();
                } else {
                    results.forEach(function(datablock){
                        if(datablock.Time >= Date.parse(req.body.data_from_date) && datablock.Time <= Date.parse(req.body.data_until_date)){
                            plant_growth_data_array.push(datablock);
                        }
                    });
                    mongoose.connection.close();
                    plant_growth_data_array.sort(function(a, b) {
                        a = new Date(a.Time);
                        b = new Date(b.Time);
                        return a>b ? 1 : a<b ? -1 : 0;
                    });
                    res.render('Datagraph/plant_growth_datagraph' , { title: 'Internet of Living Things - Smartpot',
                        plant_growth_data : plant_growth_data_array, 'slot_array' : slot_array } );
                }
            })


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



module.exports = router;