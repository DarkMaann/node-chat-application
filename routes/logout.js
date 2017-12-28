var express = require('express');
var router = express.Router();

// handle get request to /logout page, clear all session data and redirect to home page
router.get('/', function(req, res, next) {

	res.clearCookie('kolacicSesije', req.session.id);
	req.session.destroy(function(err) {
		if (err) console.log('Session was not successfully destroyed');
	});
	res.redirect('/');

});


module.exports = router;
