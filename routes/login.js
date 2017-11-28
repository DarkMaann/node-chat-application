var express = require('express');
var router = express.Router();
var User = require('../public/javascripts/userModel');
var mongoose = require('mongoose');

let conStr = 'mongodb://localhost:27017/ChatUsers';

mongoose.connect(conStr, {useMongoClient: true}, function (err) {
	if (err) throw err;
	console.log('Successfully connected to database ChatUsers...');
});

router.post('/', function (req, res, next) {
	let credentialsBase64 = req.header('Authorization').split(' ')[1];
	let credentialsAscii = Buffer.from(credentialsBase64, 'base64').toString().split(':');
	
	let potentialUser = new User({
		username: credentialsAscii[0],
		password: credentialsAscii[1]
	});

	User.findOne({username: potentialUser.username}, function (err, user) {
		if (err) throw err;
		if (user) {
			user.comparePassword(potentialUser.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					res.set('Content-type','text/plain');
					res.status(200).send('http://localhost:3000/chat');
				}
				else {
					res.set('Content-type','text/plain');
					res.status(200).send('http://localhost:3000/');
				}
			});
		}
		else {
			potentialUser.save((err) => {
				if (err) throw err;
				res.set('Content-type','text/plain');
				res.status(200).send('http://localhost:3000/chat');
			});
		}
	});

});

module.exports = router;
