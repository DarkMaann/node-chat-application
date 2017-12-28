var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../public/javascripts/userModel'); // import mongoose schema based user model

// connection string for user database
let connStr = 'mongodb://localhost:27017/ChatUsers';


// open connection to database using the deprecated way with useMongoClient parameter
mongoose.connect(connStr, {useMongoClient: true}, function(err) {
	if (err) throw err;
	console.log('Successfully connected to database ChatUsers...');
});



// handle the post request to /login sending appropriate url string
router.get('/', function(req, res, next) {

	// check if user is accessing this page through homePage or manually, and if he/she has entered credentials
	if (!req.session.homePage || typeof req.header('Authorization') == 'undefined') return res.redirect('/');
	req.session.homePage = false; //reset homePage boolean for the next time

	// get the header and split the base64 (username and password) part of the header
	let credentialsBase64 = req.header('Authorization').split(' ')[1];
	
	// create node buffer brom base64 string, convert it to text format and split name and password
	let credentialsAscii = Buffer.from(credentialsBase64, 'base64').toString().split(':');
	
	if (!credentialsAscii[0] || !credentialsAscii[1]) return res.status(401).send('You must enter both username and password.');

	let potentialUser = new userModel({
		username: credentialsAscii[0],
		password: credentialsAscii[1]
	});

	// check in the database if the user with given username exist
	userModel.findOne({username: potentialUser.username}, function(err, user) {
		if (err) throw err;
		
		// if user already exist, check validity of the password, else save the new user
		if (user) {

			user.comparePassword(potentialUser.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					req.session.name = potentialUser.username;
					res.status(200).send('http://192.168.8.101:3000/chat');
				} else {
					res.status(401).send('You entered the wrong password.');
				}
			});

		} else {

			potentialUser.save((err) => {
				if (err) throw err;
				req.session.name = potentialUser.username;
				// send the chat page to the new user....for now
				res.status(200).send('http://192.168.8.101:3000/chat');
			});

		}

	});

});


module.exports = router;
