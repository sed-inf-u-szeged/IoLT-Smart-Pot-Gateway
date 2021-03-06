var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

router.get('/',function(req,res){
    req.session.reload(function(){
        if(req.session.isAuthorized == true){

            mongoose.connect("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });
            let usersDB = mongoose.createConnection("mongodb://172.16.0.3:27017/SZBK-felhasznalok", { useNewUrlParser: true });

            let raspberry_name_array = [];
            let users_name_array = [];

            

            let Device_schema = mongoose.Schema({
                Device_name : String,
                Associated_project : String
            });

            let User_schema = mongoose.Schema({
                username : String,
                password : String,
                role : String
            });
                
            let Model2;
            let Model3;

           

            try {
                Model2 = mongoose.model('Devices_model');
            } catch (error) {
                Model2 = mongoose.model('Devices_model',Device_schema,'Devices');
            }

            try {
                Model3 = usersDB.model('Users_model');
            } catch (error) {
                Model3 = usersDB.model('Users_model',User_schema,'Felhasznalok');
            }

           

            let Promise2 = Model2.find({},function(err,results){
                //Hibakezelés
                if(err) {
                console.log(err)
                console.log("Lekérdezési hiba történt.");
                mongoose.connection.close();
                throw err;
                } else if (results.length < 1) {
                    console.log("A 'Devices' adatbázis üres..");
                    mongoose.connection.close();
                } else {
                    results.forEach(function(record){
                        raspberry_name_array.push(record.Device_name);
                    });
                }
            });
            
            let Promise3 = Model3.find({},function(err,results){
                //Hibakezelés
                if(err) {
                console.log(err)
                console.log("Lekérdezési hiba történt.");
                usersDB.close();
                throw err;
                } else if (results.length < 1) {
                    console.log("A 'Users' adatbázis üres..");
                    usersDB.close();
                    throw err;
                } else {
                    results.forEach(function(record){
                        users_name_array.push(record.username);
                    });
                }
            });

            Promise.all([Promise2, Promise3]).then(function(){
                mongoose.connection.close();
                usersDB.close();
                raspberry_name_array.sort(compareStartingChar);
                users_name_array.sort(compareStartingChar);
            }).then(function(){
                res.render('Creation views/create_project_new.pug' , { title: 'Internet of Living Things - Smartpot' ,
                    'raspberries' : raspberry_name_array, 'userNamePool' : users_name_array});
            });
        } else {
            res.send('Your session has timed out. Please, re-login on the login page.');
        };
    });
});


function compareStartingChar(a,b) {
	if (a < b)
	  return -1;
	if (a > b)
	  return 1;
	return 0;
  }




  // Project modification logic

router.post('/createProject',function(req,res){

    let not_fully_filled = false;
    let currentdate = new Date();

    if (Object.keys(req.body).length != 6 || Date.parse(req.body.Start_date) > Date.parse(req.body.End_date) ||
      Date.parse(req.body.Start_date) < currentdate || Date.parse(req.body.End_date) < currentdate) {
        not_fully_filled = true;
    }

    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            let element = req.body[key];
            if (element == "") {
                not_fully_filled = true;
            }    
        }
    }

    if(!not_fully_filled) {

    mongoose.connect("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });

        let project_Schema = mongoose.Schema({
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
        let Raspberry_array = [];
        let Projects_array = [];
        let errormessages = [];
        let name_error = false;
        let date_error = false;
        let isInserted = false;

        try {
            Model = mongoose.model('Create_project_model');
        } catch (error) {
            Model = mongoose.model('Create_project_model',project_Schema,'Projects');
        }

            Model.find({},function(err,res){
                if(err){
                    mongoose.connection.close();
                    res.send(err);
                } else {
                    res.forEach(project => {
                            if (project.Name == req.body.project_name) {
                                name_error = true;
                            }
                        Projects_array.push(project);
                    });
                }
            }).then(function(){
                if(name_error == false) {
                if(typeof req.body.raspberries == 'string') {
                    Raspberry_array.push(req.body.raspberries);
                } else {
                    Raspberry_array = Object.values(req.body.raspberries);
                }
                
                if(Projects_array.length > 0) {
                    Raspberry_array.forEach(raspberry => {
                            Projects_array.forEach(project => {
                                project.Raspberries.forEach(associated_raspberry => {
                                    if(associated_raspberry == raspberry) {
                                        if(Date.parse(req.body.Start_date) <= Date.parse(project.End_date) && Date.parse(req.body.Start_date) >= Date.parse(project.Start_date)) {
                                            date_error = true;
                                            errormessages.push("A kezdődátum nem lehet hamarabb, mint "+project.Name+" nevű project végdátuma. Konfliktust okozó eszköz neve: " + associated_raspberry);
                                        } else if (Date.parse(req.body.End_date) >= Date.parse(project.Start_date) && Date.parse(req.body.End_date) <= Date.parse(project.End_date)) {
                                            date_error = true;
                                            errormessages.push("A végdátum nem lehet később, mint "+project.Name+" nevű project kezdődátuma. Konfliktust okozó eszköz neve: " + associated_raspberry);
                                        }
                                    }
                                });
                            });
                    });
                }
            }
            }).then(function(){
                //res.send(errormessages);
                
                if(date_error == false && name_error == false) {
                    let o = {
                        Name : req.body.project_name,
                        Owner : req.body.owners,
                        Raspberries : req.body.raspberries,
                        Info : req.body.projectinfo,
                        Start_date : req.body.Start_date,
                        End_date : req.body.End_date,
                        isStarted : false,
                        isOver : false
                    }
                    mongoose.connection.collection('Projects').insertOne(o);
                    isInserted = true;
                }

           }).then(function(){
               if(name_error) {
                   mongoose.connection.close();
                   res.send("A Project with that name already exists in the system."); 
               } else if (date_error) {
                   mongoose.connection.close();
                   res.send(errormessages);
               } else if (isInserted) {
                   mongoose.connection.close();
                   res.redirect("/dashboard");
               } else {
                   mongoose.connection.close();
                   res.send("Error.")
               }

           }).catch(function (err) {
			console.log(err);
        });
        
    } else {
        res.send("Please, fill out the form properly.");
    }
    
});

module.exports = router;