var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

router.get('/', function(req, res) {
	req.session.reload(function(err) {
	if(req.session.isAuthorized == true) {

		var projects_array = []; // Created to contain queried projects.
        var raspberries_array = []; // Created to contain each raspberry, and all the projects each one is associated with as objects.

            mongoose.connect("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });

            let project_schema = mongoose.Schema({
            Name : String,
            Owner : Object,
            Raspberries : Object,
            Info : String,
            Start_date : Date,
            End_date : Date,
            isStarted : Boolean,
            isOver : Boolean
            });

            let device_schema = mongoose.Schema({
                Device_name : String,
                Associated_project : String
            });

            let Model1;
            let Model2;
            
            try {
                Model1 = mongoose.model('Project_model');
            } catch (error) {
                Model1 = mongoose.model('Project_model',project_schema,'Projects');
            }
            try {
                Model2 = mongoose.model('Device_model');
            } catch (error) {
                Model2 = mongoose.model('Device_model',device_schema,'Devices');
            }

            // promise1 to get projects to the array.
            let promise1 = Model1.find({},function(err,results){
                //Hibakezelés
                if(err) {
                console.log(err)
                console.log("Error occured during query-execution.");
                mongoose.connection.close();
                } else if (results.length < 1) {
                    console.log("The 'Projects' collection is empty.");
                    mongoose.connection.close();
                } else {
                    results.forEach(function(record){
                        projects_array.push(record);
                    });
                }
            });

            //promise2 to create objects into the array for each registered device.
            let promise2 = Model2.find({},function(err,results){
                //Hibakezelés
                if(err) {
                console.log(err)
                console.log("Error occured during query-execution.");
                mongoose.connection.close();
                } else if (results.length < 1) {
                    console.log("The 'Devices' collection is empty.");
                    mongoose.connection.close();
                } else {
                    results.forEach(function(record){
                        let o = {};
                        o.Device_name = record.Device_name;
                        o.Associated_projects = [];
                        o.Currently_working_on = record.Associated_project;
                        raspberries_array.push(o);
                    });
                }
            });

            //Elvileg akkor most fel van töltve mind3 tömb.

            Promise.all([promise1, promise2]).then(function(){
                mongoose.connection.close();
                // Outer cycles to iterate through all project in every device's case
                raspberries_array.forEach(raspberry_record => {
                    projects_array.forEach(project_record => {
                        if(!project_record.isOver) {
                        // Need a third foreach to iterate through each project's inner raspberry-array, check if it matches with the outer cycle's device name.
                        console.log(typeof project_record.Raspberries);
                        console.log(project_record.Raspberries);
                        if(typeof project_record.Raspberries == 'string') {
                            if(project_record.Raspberries == raspberry_record.Device_name){
                                raspberry_record.Associated_projects.push(project_record.Name);
                            }
                        } else {
                        project_record.Raspberries.forEach(inner_raspberry_name => {
                            if(inner_raspberry_name == raspberry_record.Device_name){
                                raspberry_record.Associated_projects.push(project_record.Name);
                                }
                            });
                        }
                        }
                    });
                });
                
            }).then(function(){
                res.render('raspberries', { title: 'Internet of Living Things - Smartpot' , 'raspberries' : raspberries_array, 'userRole' : req.session.role });
            });
	} 
    });
});

router.post('/deleteDevice',function(req,res) { 

    // Erre még majd kell egy + kritérium, ha kész a projekt start-stop gomb kombó.

    mongoose.connect("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });
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

        if (req.body.Associated_projects == '[]'){
            Model.deleteOne({ Device_name: req.body.Delete_request}, function (err) {
                if(err){
                    console.log("!!EREDETI ERR!!"+err);
                    mongoose.connection.close();
                }
                }).then(function(){
                res.redirect('/raspberries');
                }).catch(function(err){
                console.log("CATCHBE MENT BE")
                console.log(err);
                mongoose.connection.close();
                res.send('Error in the deletion process.');
            });
        } else {
            res.send("Error. Can not delete a device that is associated with a project.")
        }
});


function compare(a,b) {
	if (a.Raspberry < b.Raspberry)
	  return -1;
	if (a.Raspberry > b.Raspberry)
	  return 1;
	return 0;
  }

  function compare2(a,b) {
	if (a.Device_name < b.Device_name)
	  return -1;
	if (a.Device_name > b.Device_name)
	  return 1;
	return 0;
  }

module.exports = router;