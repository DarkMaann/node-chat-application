var express = require('express');
var router = express.Router();

// handle the get request to / sending the home page to the user
router.get('/', function(req, res, next) {
	res.render('index', { title: 'chatApp' });
});


module.exports = router;

