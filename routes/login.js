var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, res, cb) {
		cb(null, `${process.cwd()}/public/images`);
	},
});
var upload = multer({storage: storage});
var mongoose = require('mongoose');
var userModel = require('../public/javascripts/userModel');
var socket = require('socket.io-client')('http://192.168.8.101:4000');


// connection string for user database
let connStr = 'mongodb://localhost:27017/ChatUsers';


// open connection to database using the deprecated way with useMongoClient parameter
mongoose.connect(connStr, {useMongoClient: true}, function(err) {
	if (err) throw err;
	console.log('Successfully connected to database ChatUsers...');
});



// handle the post request to /login (from ./ ) and handle user login
router.get('/', function(req, res, next) {

	// check if user is accessing this page through homePage or manually, and if he/she has entered credentials
	if (!req.session.homePage || typeof req.header('Authorization') == 'undefined') return res.redirect('/');
	req.session.homePage = false; //reset homePage boolean for the next time

	// get the header and split the base64 (username and password) part of the header
	let credentialsBase64 = req.header('Authorization').split(' ')[1];
	
	// create node buffer brom base64 string, convert it to text format and split name and password
	let credentialsAscii = Buffer.from(credentialsBase64, 'base64').toString().split(':');
	
	if (!credentialsAscii[0] || !credentialsAscii[1]) return res.status(401).send('You must enter both username and password.');

	
	let username = credentialsAscii[0];
	let password = credentialsAscii[1];
	
	// check in the database if the user with given username exist
	userModel.findOne({username: username}, function(err, user) {
		if (err) throw err;
		
		// if user already exist, check validity of the password
		if (user) {
			
			// if it is a match, forward the user to chat page
			user.comparePassword(password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					req.session.name = username;
					req.session.image = user.image;
					res.status(200).send('http://192.168.8.101:3000/chat');
					// notify server that a new user has logged in
					socket.emit('usersNumberChangedClient', {name: req.session.name});
				} else {
					res.status(401).send('You entered the wrong password.');
				}
			});
			
		} else {
			// user doesn't exist, send appropriate message
			res.status(401).send(`You entered the wrong username, or you didn't create an account.`);
		}
		
	});
	
});



// hande post request to /login (from /signin) and register new user
router.post('/', upload.single('image'), function(req, res, next) {
	
	// check if password entered for the second time matches with first one
	if (req.body.password !== req.body.password2) {
		req.session.msg = 'Passwords must match.';
		res.redirect('./signin');
	}
	
	let potentialUser = new userModel({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		gender: req.body.gender,
		birthdate: req.body.birthdate,
		image: `./images/${req.file.filename}`
	});
	
	// save the user to the database and save name to the existing session
	potentialUser.save((err) => {
		if (err) throw err;

		req.session.name = potentialUser.username;
		req.session.image = potentialUser.image;

		// send the chat page to the new user
		res.redirect('./chat');
	
		// notify server that a new user has logged in
		socket.emit('usersNumberChangedClient');

	});


});


module.exports = router;
