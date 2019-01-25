//Express, router, és konstans deklarációk.
var express = require('express');
var router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');

//Express router beállítása

var dashboard_routes = require('./dashboard');
var lekerdezes_routes = require('./lekerdezes');
var projektek_routes = require('./projektek');
var raspberries_routes = require('./raspberries');

var create_device_routes = require('./Creation routes/create_device');
var create_project_routes = require('./Creation routes/create_project_new');
var modify_project_routes = require('./Creation routes/modify_project');


router.use('/dashboard', dashboard_routes);
router.use('/lekerdezes', lekerdezes_routes);
router.use('/projektek', projektek_routes);
router.use('/raspberries', raspberries_routes);

router.use('/create_device', create_device_routes);
router.use('/create_project', create_project_routes);
router.use('/modify_project', modify_project_routes);



    router.get('/', function(req, res) {
        req.session.reload(function(err) {
            res.redirect('/dashboard');
        });
    });

    router.get('/logout',function(req,res) {
        req.session.destroy();
        res.redirect('/dashboard');
    });

// Ha a gyökérben szeretnénk lekezelni a posztolásokat, akkor itt így kell megírni.

    router.post('/lekerdezes',function(req,res) {

        //A lekérdezési logikát majd itt kell megírni, ha kész a helyes mentés
        
    });

    router.post('/dashboard',function(req,res) {
        req.session.reload(function(err) {

        req.session.isAuthorized = false;
        
        mongoose.connect("mongodb://172.16.0.2:27017/SZBK-felhasznalok", { useNewUrlParser: true }).catch(function(err){
            res.send('Mongo-server is offline. Error message: '+ err);
        });
        let db = mongoose.connection;
        let felhsema = mongoose.Schema({
            username : String,
            password : String,
            role: String
        });
        let Model;
        try {
            Model = mongoose.model('Felhasznalomodell');
          } catch (error) {
            Model = mongoose.model('Felhasznalomodell',felhsema,'Felhasznalok');
          }

        Model.find({},function(err,results){
            //Hibakezelés
            if(err) {
            console.log(err)
            console.log("Lekérdezési hiba történt.");
            db.close();
            mongoose.connection.close();
            } else if (results.length < 1) {
                console.log("A felhasználó adatbázis üres..");
                db.close();
                mongoose.connection.close();
            } else {
                results.forEach(function(record){
                    if(req.body.felhnev == record.username && req.body.jelszo == record.password) {
                        console.log(req.body.felhnev+"  ;  "+req.body.jelszo);
                        req.session.user = req.body.felhnev;
                        req.session.role = record.role;
                        req.session.isAuthorized = true;
                        req.session.save();
                    }
                });
                db.close();
                mongoose.connection.close();
            }    
        }).then(function(){
            if(req.session.isAuthorized == true){
                req.session.projectListType = 1;
                if (!fs.existsSync(__dirname+'/../users/'+req.session.user)){
                    fs.mkdirSync(__dirname+'/../users/'+req.session.user);
                }
                console.log(req.session.user+" ;; "+req.session.isAuthorized+ " ;; "+req.session.role+ " ;; "+req.session.projectListType);
                res.render('dashboard', { title: 'Internet of Living Things - Smartpot' , 'role' : req.session.role});
                } else {
                res.render('login', { title: 'Internet of Living Things - Smartpot' })
                }
        });
    });
    });

    function getConfig(callback) {
        
        //Egyenlőre tesztelés miatt be vannak égetve a db-utak a programba. Majd ezt kell használni, hogy átadjuk a konfigurációs tömböt.

        fs.readFile('conf.ini', 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            var utvonal_tomb = [];
            let sorok = data.split('\n');
            sorok.forEach(sor => {
                if(!((sor.charAt(0) == "#") || (sor.charAt(1) == "#"))) {
                    sor = sor.replace(/\r?\n|\r/,"");
                    utvonal_tomb.push(sor);
                }
            });
            callback(utvonal_tomb);
          }); 
    }
       
    
module.exports = router;