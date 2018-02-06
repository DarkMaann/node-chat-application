// this variable will hold latest array of active users, for users who only refresh their page
var activeSessions;
// this variable will hold array of msg objects, i.e. chat history to serve to clients on page refresh
var chatHistory = [];

function ioHandler(io, store) {

	// websocket listener for client messages
	io.on('connection', socket => {


		// broadcast chat message when received from certain user
		socket.on('clientMsg', data => {
			io.emit('writeToChatHistory', data);
			io.emit('serverMsg', data);
			// update local version of chatHistory for quicker access
			chatHistory.push(data);
		});


		// listen for client log in or out and send signal to childSpawner to 
		// tell his subprocess to fetch active sessions and update their user-online list
		socket.on('usersNumberChangedClient', data => {
			console.log(`Client ${data ? data.name : ''} has ${data ? 'entered' : 'left'}`);
			socket.broadcast.emit('getActiveSessions');
		});


		// listen for local socket from childSpawner and act when you receive active sessions
		socket.on('gotActiveSessions', data => {
			activeSessions = data.sessions
				.map(element => 'name' in JSON.parse(element.session) ? JSON.parse(element.session) : null)
				.filter(element => element);
			io.emit('updateUserList', {sessions: activeSessions});
		});
		

		// listen for local socket from childSpawner and act when you receive chat history
		socket.on('gotChatHistory', data => {
			chatHistory = data;
			io.emit('updateChatHistory', data);
		});


		// send list of active sessions only to the user who refreshed page
		socket.on('userPageRefreshed', data => {
			socket.emit('updateUserList', {sessions: activeSessions || []});
			socket.emit('updateChatHistory', chatHistory);
		});

		
	});

};


module.exports = ioHandler;
