var express = require('express');
var router = express.Router();
var socket = require('socket.io-client')('http://192.168.8.101:4000');

// handle get request to /logout page, clear all session data and redirect to home page
router.get('/', function(req, res, next) {

	res.clearCookie('kolacicSesije', req.session.id);
	req.session.destroy(function(err) {
		if (err) console.log('Session was not successfully destroyed');
	});
	res.redirect('/');
	
	// notify server that a user has left
	socket.emit('usersNumberChangedClient');

});


module.exports = router;
