var socket = require('socket.io-client')('http://192.168.8.101:4000/childSpawner');
var {fork} = require('child_process');

function forkActiveSessionsGetter(processUrl) {
	// change port that inspector procotol listens to for the child process
	// so that it doesn't conflict with default port of 9229
	let childProcess = fork(processUrl, {execArgv: ['--inspect=9227']});

	// when the signal comes, get active sessions from child process
	socket.on('getActiveSessions', () => {
		childProcess.send('getActiveSessions');
	});

	// and forward it back to socket server (io.js)
	childProcess.on('message', data => socket.emit('gotActiveSessions', data));

	// send the command to load active sessions at node app startup, precaution for possible app crash 
	childProcess.send('getActiveSessions');
}

function forkChatHistorySetter(processUrl) {
	let childProcess = fork(processUrl, {execArgv: ['--inspect=9225']});

	socket.on('writeToChatHistory', data => {
		childProcess.send(data);
	});
}

function forkChatHistoryGetter(processUrl) {
	let childProcess = fork(processUrl, {execArgv: ['--inspect=9223']});

	socket.on('getChatHistory', () => {
		childProcess.send('getChatHistory');
	});

	childProcess.on('message', data => socket.emit('gotChatHistory', data));

	// send the command to load chat history at node app startup, so you can manage it in memory for quick access
	childProcess.send('getChatHistory');
}


module.exports = {
	forkActiveSessionsGetter,
	forkChatHistorySetter,
	forkChatHistoryGetter
};
