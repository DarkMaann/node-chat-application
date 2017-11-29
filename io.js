module.exports = function (io) {

	// websocket listener for client messages
	io.on('connection', (socket) => {
		socket.on('clientMsg', (data) => {
			io.emit('serverMsg', data);
		});
	});

	
};
