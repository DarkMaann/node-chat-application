var express = require('express');
var router = express.Router();

// handle the get request to / sending the home page to the user
router.get('/', function(req, res, next) {
	req.session.homePage = true;

	//check if the user has active session and is logged in, if so redirect him/her to the chat page
	if (!req.session.name) {
		res.render('index', {
			title: 'chatApp',
			message: 'Enter your username and password'
		});
	} else {
		res.redirect('./chat');
	}

});


module.exports = router;

