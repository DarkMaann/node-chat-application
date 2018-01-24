function ioHandler(io, store) {
	// websocket listener for client messages
	io.on('connection', socket => {


		// broadcast chat message when received from certain user
		socket.on('clientMsg', data => {
			io.emit('serverMsg', data);
		});


		// listen for client log in or out and send signal to childSpawner to 
		// tell his subprocess to fetch active sessions and update their user-online list
		socket.on('usersNumberChangedClient', data => {
			console.log(`Client ${data ? data.name : ''} has ${data ? 'entered' : 'left'}`);
			socket.broadcast.emit('getActiveSessions');
		});


		// listen for local socket from childSpawner and act when you receive active sessions
		socket.on('forwardActiveSessions', data => {
			let activeSessions = data.sessions.map(element => 'name' in JSON.parse(element.session) ? JSON.parse(element.session) : null)
									 .filter(element => element);
			io.emit('updateUserList', {sessions: activeSessions});
		});
		

	});
};


module.exports = ioHandler;
