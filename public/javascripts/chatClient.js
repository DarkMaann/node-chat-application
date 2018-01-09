var socket = require('socket.io-client')('http://192.168.0.16:4000'); // get the socket object and connect to server
var creator = require('./createHtml'); // get the html creation library


window.onload = () => {

	let chatSpace = document.getElementById('chatSpace');
	let messageSpace = document.getElementById('messageSpace');
	let btn = document.getElementById('btn');
	let yourName = document.getElementById('yourName').innerHTML;

	// start listening for server messages
	socket.on('serverMsg', (data) => {
		let renderedMsg = (data.name == yourName ? 'You said' : data.name + ' said') + ': ' + data.msg;
		let leftOrRight = data.name == yourName ? 'msgRight' : 'msgLeft';
		let newEl = creator.createHTML('p', chatSpace, renderedMsg);
		creator.appendAttr(newEl, 'class', leftOrRight);
		chatSpace.scrollTop = chatSpace.scrollHeight; // set automatic scrolldown of the scrollbar

	});

	// start listening for enter keypress
	document.addEventListener('keypress', (event) => {

		// send message if enter was pressed and message box isn't empty
		if (event.charCode == 13 && messageSpace.value != ''){
			socket.emit('clientMsg', {name: yourName, msg: messageSpace.value});
			messageSpace.value = '';
		}

	});

	// click listener for sending request to /logout page
	btn.addEventListener('click', function() {
		location.replace('http://192.168.0.16:3000/logout');
	});


};

