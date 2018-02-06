var express = require('express');
var router = express.Router();

// handle get request to /logout page, clear all session data and redirect to home page
router.get('/', function(req, res, next) {

	// redirect user if he/she has already active logged in session
	if (!req.session.name) {
		let msg = 'msg' in req.session ? req.session.msg : '';
		if (msg) delete req.session.msg;
		res.render('signin', {
			title: 'Sign In',
			instruction: 'Please fill the given form',
			message: msg
		});
	} else {
		res.redirect('/chat');
	}

});


module.exports = router;
