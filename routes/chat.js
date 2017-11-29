var express = require('express');
var router = express.Router();

// handle the get request to /chat and send the chat page to the user
router.get('/', function(req, res, next) {
	res.render('chat', {name: 'User'});
});


module.exports = router;
