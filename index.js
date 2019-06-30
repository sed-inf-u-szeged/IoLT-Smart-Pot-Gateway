const express = require('express');
const app = express();
const path = require('path');
var session = require('express-session');

var router = express.Router();
var index = require('./routes/index');

//configure render engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

//middleware and static expression.
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({limit: '50mb',extended:true}));
app.set('trust proxy',1);
app.use(session({secret: "#T89vX@Cjd#lfjvN#$#1tHh^=sd11//49234X&@E^21KDltsđx#$$231éáüaBsx2>ég21",
resave:true,
saveUninitialized:true,
cookie: { secure: false, maxAge: 3000000 }
}));
app.use(index,router);



app.listen(3000, () => console.log('A gateway a 3000-es porton figyel!'))

module.exports = router;
