var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	req.session.reload(function(err) {
		if(req.session.isAuthorized == true) {
			res.render('dashboard', { title: 'Internet of Living Things - Smartpot' , 'role' : req.session.role });
		} else {
			res.render('login', { title: 'Internet of Living Things - Smartpot' });
		}
	});
});

module.exports = router;