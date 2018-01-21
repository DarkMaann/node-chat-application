module.exports = function(io) {
	// register a way to touch session if user is active (keypressing) but not changing pages
	// (express-session middleware touches only when page changed)
	return function(req, res, next) {
		
		if (req.session.name && !('listenTouch' in req.session)) {
			io.on('connection', socket => {
				socket.on('clientActive', data => {
					req.session.touch();
					req.sessionStore.touch(req.session.id, req.session, err => {if (err) console.log(`Error in Store.touch: ${err}`);});
				});
			});
			req.session.listenTouch = true;
		};

		next();
		
	};

};
