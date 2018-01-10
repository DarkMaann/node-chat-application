var express = require('express');
var router = express.Router();

// handle the get request to /chat and send the chat page to the user
router.get('/', function(req, res, next) {
	
	// check if the user that manually entered /chat in the url bar is authorized or not, if not send him to home page
	if (req.session.name) {
		res.render('chat', {
			name: req.session.name,
			image: req.session.image
		});
	} else {
		res.redirect('/');
	}


});


module.exports = router;
