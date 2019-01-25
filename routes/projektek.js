var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

router.get('/', function(req, res) {
    req.session.reload(function(err) {
    if(req.session.isAuthorized == true) {
        var projektek_tomb = [];

        

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
                        projektek_tomb.push(record);
                    } else {
                        let ownerArray = [];
                        if(typeof record.Owner == 'string') {
                            ownerArray.push(record.Owner);
                        } else {
                            ownerArray = Object.values(record.Owner);
                        }
                        if (ownerArray.includes(req.session.user)) {
                                projektek_tomb.push(record);
                            }
                    }
                    
                });
                mongoose.connection.close();
            }
        }).then(function(){
            projektek_tomb.sort(projekt_sort);
            res.render('projektek', { title: 'Internet of Living Things - Smartpot' , 'projektek_tomb': projektek_tomb , 'listType': req.session.projectListType });
        });

    } else {
        res.status(200).send("Your session has timed out. Please, login again.");
        }	
    });
});

router.get('/current_projects',function(req,res){
    req.session.reload(function(err){
        if(req.session.isAuthorized == true) {
            req.session.projectListType = 1;
            res.redirect('/projektek');
        } else {
            res.send("Your session has timed out. Please, re-login on the login page.");
        }
    });
});

router.get('/finished_projects',function(req,res){
    req.session.reload(function(err){
        if(req.session.isAuthorized == true) {
            req.session.projectListType = 2;
            res.redirect('/projektek');
        } else {
            res.send("Your session has timed out. Please, re-login on the login page.");
        }
    });
});


router.post('/endProject',function(req,res){

    let connection = mongoose.createConnection("mongodb://172.16.0.3:27017/SZBK-raspik", { useNewUrlParser: true });

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

    let device_Schema = mongoose.Schema({
        Device_name: String,
        Associated_project: String
    });

    let Model1;
    let Model2;

    try {
        Model1 = connection.model('Update_project_model');
    } catch (error) {
        Model1 = connection.model('Update_project_model',project_Schema,'Projects');
    }
    try {
        Model2 = connection.model('Update_device_model');
    } catch (error) {
        Model2 = connection.model('Update_device_model',device_Schema,'Devices');
    }

    let date = new Date();

    console.log(req.body.ended_project_raspberries);

    
    connection.on('open',function(){
        
       let Promise1 =  Model1.updateOne({ Name: req.body.ended_project_name }, { $set: { isOver: true , End_date : date } }, function(err, res) {
            if(err){
                connection.close();
                throw err;
            } else {
                console.log(res);
            }
        });

        let Promise2 = new Promise(function(resolve,reject){
            var c_array = JSON.parse(req.body.ended_project_raspberries);
            for (let i = 0; i < c_array.length; i++) {
                console.log(i+". Elemen vagyok.")
                Model2.updateOne({ Device_name: c_array[i] }, { $set: { Associated_project: '' } }, function(err,res) {
                    if(err){
                        throw err;
                    }
                    /*
                        console.log('Function adatok');
                        console.log(c_array[i]);
                        console.log(i+1);
                        console.log(c_array.length);
                        */
                    console.log(res);
                }).then(function(){
                    if(i+1 == c_array.length){
                        console.log("resolved");
                        resolve();
                    }
                });
            }
        });

        Promise.all([Promise1,Promise2]).then(function(){
            connection.close();
            res.send("Elvileg kész.")
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