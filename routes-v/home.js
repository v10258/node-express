var express = require('express');
var router = express.Router();


// GET /signup 注册页
router.get('/', function(req, res, next) {
	var locals = res.locals;
	
	locals.section = 'home';

  	res.render('home');
});

module.exports = router;