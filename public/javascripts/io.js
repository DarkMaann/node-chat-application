// this variable will hold latest array of active users, for users who only refresh their page
var activeSessions = [];
// this variable will hold objects of user names and their socket IDs, for io server to send specificaly when needed
var socketIdList = {};
// this variable will hold array of msg objects, i.e. chat history to serve to clients on page refresh
var chatHistory = [];

function ioHandler(io, store) {
	
	let childSpawnerSocket = io.of('/childSpawner');
	
	childSpawnerSocket.on('connection', socket => {
		
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
			socket.broadcast.emit('updateChatHistory', data);
		});

	});

	// websocket listener for client messages
	io.on('connection', socket => {

		// broadcast chat message when received from certain user
		socket.on('clientMsgGroup', data => {
			childSpawnerSocket.emit('writeToChatHistory', data);
			io.emit('serverMsgGroup', data);
			// update local version of chatHistory for quicker access
			chatHistory.push(data);
		});

		// emit message to sender and receiver only (implementing a single chat)
		socket.on('clientMsgSingle', data => {
			let sender = data.name;
			let receiver = data.to;
			io.to(socketIdList[sender]).emit('serverMsgSingle', {name: sender, to: receiver, msg: data.msg});
			if (sender === receiver) return;
			io.to(socketIdList[receiver]).emit('serverMsgSingle', {name: sender, to: receiver, msg: data.msg});
		});

		// listen for client log in or out and send signal to childSpawner to 
		// tell his subprocess to fetch active sessions and update their user-online list
		socket.on('usersNumberChangedClient', data => {
			console.log(`Client ${data ? data.name : ''} has ${data ? 'entered' : 'left'}`);
			childSpawnerSocket.emit('getActiveSessions');
		});

		// send list of active sessions only to the user who refreshed page
		socket.on('userPageRefreshed', data => {
			socketIdList[data.name] = socket.id;
			socket.emit('updateUserList', {sessions: activeSessions || []});
			socket.emit('updateChatHistory', chatHistory);
		});
		
	});

};


module.exports = ioHandler;
