var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../public/javascripts/userModel'); // import mongoose schema based user model

// connection string for user database
let connStr = 'mongodb://localhost:27017/ChatUsers';

// open connection to database using the deprecated way with useMongoClient parameter
mongoose.connect(connStr, {useMongoClient: true}, function(err) {
	if (err) throw err;
	console.log('Successfully connected to database ChatUsers...');
});

// handle the post request to /login sending appropriate url string
router.post('/', function (req, res, next) {

	// get the header and split the base64 part of the header
	let credentialsBase64 = req.header('Authorization').split(' ')[1];
	
	// create node buffer brom base64 string, convert it to text format and split name and password
	let credentialsAscii = Buffer.from(credentialsBase64, 'base64').toString().split(':');
	
	let potentialUser = new User({
		username: credentialsAscii[0],
		password: credentialsAscii[1]
	});

	// check in the database if the user with given username exist
	User.findOne({username: potentialUser.username}, function(err, user) {
		if (err) throw err;
		
		// if user already exist, check validity of the password, else save the new user
		if (user) {

			user.comparePassword(potentialUser.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					res.set('Content-type','text/plain');
					res.status(200).send('http://localhost:3000/chat'); // send the chat page for a valid login
				} else {
					res.set('Content-type','text/plain');
					res.status(200).send('http://localhost:3000/'); // send the home page for an invalid login
				}
			});

		} else {

			potentialUser.save((err) => {
				if (err) throw err;
				res.set('Content-type','text/plain');
				res.status(200).send('http://localhost:3000/chat'); // send new user the chat page
			});

		}

	});

});


module.exports = router;
