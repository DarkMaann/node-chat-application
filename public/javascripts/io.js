// initialize child process to be in charge of getting active sessions from database
var {fork} = require('child_process');
var checkActiveSessions = fork('./checkActiveSessions.js');


function ioParser(io) {
	
	// websocket listener for client messages
	io.on('connection', socket => {

		// broadcast chat message when received from certain user
		socket.on('clientMsg', data => {
			io.emit('serverMsg', data);
		});

		// listen for client log in or out and fetch active sessions and update their user-online list
		socket.on('usersNumberChangedClient', data => {
			console.log(`Client ${data ? data.name : ''}or someone has entered or left`);
			checkActiveSessions.send({msg: 'giveMeSessions'});
		});
		
		checkActiveSessions.on('message', data => {
			console.log(data.msg);
			//io.emit('usersNumberChangedServer', data);
		});

	});

};


module.exports = ioParser;
