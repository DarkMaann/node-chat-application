import { userInfo } from 'os';

var socket = require('socket.io-client')('http://192.168.8.101:4000'); // get the socket object and connect to server
var creator = require('./createHtml'); // get the html creation library


window.onload = () => {

	let chatSpace = document.getElementById('chatSpace');
	let messageSpace = document.getElementById('messageSpace');
	let usersSpace = document.getElementById('usersDiv');
	let btn = document.getElementById('btn');
	let yourName = document.getElementById('yourName').innerHTML;


	// start listening for chat messages coming from socket server (serverMsg event) via broadcasting
	socket.on('serverMsg', data => {
		let renderedMsg = (data.name == yourName ? 'You said' : data.name + ' said') + ':\n' + data.msg;
		let leftOrRight = data.name == yourName ? 'msgRight' : 'msgLeft';
		let newEl = creator.createHTML('p', chatSpace, renderedMsg);
		creator.appendAttr(newEl, 'class', leftOrRight);
		chatSpace.scrollTop = chatSpace.scrollHeight; // set automatic scrolldown of the scrollbar

	});

	// start listening for enter keypress
	document.addEventListener('keydown', event => {
		// emit clientMsg event and send chat message to socket server if enter was pressed and message box isn't empty 
		if (event.key == 'Enter' && messageSpace.value != ''){
			socket.emit('clientMsg', {name: yourName, msg: messageSpace.value});
			messageSpace.value = '';
		}

		// emit this event for server to register that user is active
		socket.emit('clientActive');

	});


	socket.on('updateUserList', data => {
		data.sessions.forEach(element => {
			let newEl = creator.createHTML('div', usersSpace, element.name);
			creator.appendAttr(newEl, 'class', 'users');
		});
	});

	// click listener for sending request to /logout page
	btn.addEventListener('click', function() {
		location.replace('http://192.168.8.101:3000/logout');
	});


};

