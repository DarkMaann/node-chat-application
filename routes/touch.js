var express = require('express');
var router = express.Router();

// handle the get request to /touch renewing maxAge cookie property
router.get('/', function(req, res, next) {

	req.session.touch();
	req.sessionStore.touch(req.session.id, req.session, err => {if (err) console.log(`Error in Store.touch: ${err}`);});
	res.end();
	
});


module.exports = router;
