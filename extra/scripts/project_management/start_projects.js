const mongoose = require('mongoose');

let currentdate = new Date();

mongoose.connect("mongodb://172.16.0.2:27017/SZBK-raspik", { useNewUrlParser: true });

function asyncquery1 (Model) {
	return new Promise(resolve => {
	Model.find({isStarted : false},function(err,res) {
		if(err) {
            throw err;
        }
        console.log("Reslength: "+res.length);
        if(res.length == 0) {
            resolve();
        }
		res.forEach(function(project,index){
            console.log();
                if(currentdate >= Date.parse(project.Start_date)) {
                    console.log(project.isStarted);
                    let o = {
                        projectname: project.Name,
                        raspberries: project.Raspberries,
                    };
                    project_array.push(o);
                        if((parseInt(res.length) - 1) == parseInt(index)) {
                            console.log("asyncquery1 resolved.");
                            resolve();
                        }
                } else {
                    if((parseInt(res.length) - 1) == parseInt(index)) {
                        console.log("Nincs indítandó projekt.");
                        resolve();
                    }
                }
        });
	});
});
};


function asyncquery2 (Model,project) {
	return new Promise(resolve => {
	Model.updateOne( {Name: project.projectname} , { $set: { isStarted: true } } ,function(err,res) {
		if(err) {
            throw err;
        }
        console.log(res);
		resolve();
	});
});
};

function asyncquery3 (projects) {
    return new Promise(resolve => {

        if(projects.length > 0) {
        let query_promise_array = [];
        projects.forEach(function(project){
            console.log(project);
            project.raspberries.forEach(function(raspberry){
                console.log(raspberry);
                let prom = Model2.updateOne( { Device_name : raspberry } , { $set: { Associated_project: project.projectname } } ,function(err,res) {
                    if(err){
                        throw err;
                    }
                    console.log(res);
                }).exec();
                query_promise_array.push(prom);
            });
        });

        Promise.all(query_promise_array).then(function(){
            resolve();
        });

    } else {
        console.log("A projects tömb üres. Nem volt munka?")
        resolve();
    }

    });
}


console.log(currentdate);

 let projektsema = mongoose.Schema({
	    _id: String,
        Name : String,
        Owner : Array,
        Raspberries : Array,
        Info : String,
        Start_date : Date,
        End_date : Date,
        isStarted : Boolean,
        isOver : Boolean
        });

 let deviceschema = mongoose.Schema({
        _id: String,
        Device_name : String,
        Associated_project : String
 });
		
let Model = mongoose.model('Projektmodell',projektsema,'Projects');
let Model2 = mongoose.model('Devicemodell',deviceschema,'Devices');


let project_array = [];
let promise_array = [];


Promise.all([asyncquery1(Model)]).then(function(){
    console.log("Rezolválodott.")
    project_array.forEach(function(project) {
        promise_array.push(asyncquery2(Model,project));
    });

    Promise.all(promise_array).then(() => {
       console.log("Harmadik query.");
       asyncquery3(project_array).then(function(){
        mongoose.connection.close();
       });
    });

});

