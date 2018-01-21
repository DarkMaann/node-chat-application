var socket = require('socket.io-client')('http://192.168.8.101:4000');
var {fork} = require('child_process');

function forkProcess(processUrl) {
	// change port that inspector procotol listens to for the child process
	// so that it doesn't conflict with default port of 9229
	process.execArgv.push('--inspect=9223');
	process.execArgv.shift();
	
	var childProcess = fork(processUrl);

	// when the signal comes, get active sessions from child process
	socket.on('getActiveSessions', () => {
		childProcess.send('getActiveSessions');
	});

	// and forward it back to socket server (io.js)
	childProcess.on('message', data => socket.emit('forwardActiveSessions', data));

}


module.exports = forkProcess;
