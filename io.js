module.exports = function (io) {

	io.on('connection', (socket) => {
		socket.on('clientMsg', (data) => {
			io.emit('serverMsg', data);
		});
	});

};
