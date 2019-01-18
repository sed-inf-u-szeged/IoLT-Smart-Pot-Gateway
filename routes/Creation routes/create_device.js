var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

router.get('/', function(req,res) {

  req.session.reload(function() {
    if(req.session.isAuthorized == true) {
	    res.render('Creation views/create_device', { title: 'Internet of Living Things - Smartpot' });
	} else {
	    res.render('login', { title: 'Internet of Living Things - Smartpot' });
		}
    });
    
});

router.post('/createNewDevice', function(req,res) {

	mongoose.connect("mongodb://127.0.0.1:27017/SZBK-raspik", { useNewUrlParser: true });
	let db = mongoose.connection;

	let raspberry_name_array = [];
	let matchFound = false;
	let isInserted = false;

	let Device_schema = mongoose.Schema({
		Device_name : String,
		Associated_project : String
		});
		let Model;
		try {
			Model = mongoose.model('Devices_model');
		} catch (error) {
			Model = mongoose.model('Devices_model',Device_schema,'Devices');
		}

		Model.find({},function(err,results){
			//Hibakezelés
			if(err) {
			console.log(err)
			console.log("Lekérdezési hiba történt.");
			db.close();
			mongoose.connection.close();
			throw err;
			} else {
				results.forEach(function(record){
					raspberry_name_array.push(record.Device_name);
				});
			}
		}).then(function() {
			raspberry_name_array.forEach(raspberry_name => {
				if(raspberry_name == req.body.devicename){
					matchFound = true;
				}
			});
			console.log(raspberry_name_array);
			console.log(matchFound);
		}).then(function() {
			if(matchFound) {
				db.close();
				mongoose.connection.close();
				res.send("A device with that Name/ID already exists in the system.")
			} else {
				let ObjectID = require('mongodb').ObjectID;
				let device = {
					_id: new ObjectID(),
					Device_name: req.body.devicename,
					Associated_project: ""
					};
				db.collection('Devices').insertOne(device);
				isInserted = true;
			}
		}).then(function() {
			if (isInserted) {
			db.close();
			mongoose.connection.close();
			res.redirect('/raspberries');
			}
		}).catch(function (err) {
			console.log(err);
		});
});

module.exports = router;