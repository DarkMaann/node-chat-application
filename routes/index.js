var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { title: 'chatApp' });
});

router.post('/', function (req, res, next) {
	let credentialsBase64 = req.header('Authorization').split(' ')[1];
	let credentialsAscii = Buffer.from(credentialsBase64, 'base64').toString();

	res.set('Content-type','text/plain');
	res.status(200).send(credentialsAscii);
});

module.exports = router;
