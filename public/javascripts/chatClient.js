var socket = require('socket.io-client')('http://localhost:4000'); // get the socket object
var creator = require('./createHtml'); // get the html creation library


window.onload = () => {

	let chatSpace = document.getElementById('chatSpace');
	let messageSpace = document.getElementById('messageSpace');
	let btn = document.getElementById('btn');


	// start listening for server messages
	socket.on('serverMsg', (data) => {
		
		let newEl = creator.createHTML('p', chatSpace, data.msg);
		creator.appendAttr(newEl, 'class', 'msgRight');
		chatSpace.scrollTop = chatSpace.scrollHeight; // set automatic scrolldown of the scrollbar

	});

	// start listening for enter keypress
	document.addEventListener('keypress', (event) => {

		// send message if enter was pressed and message box isn't empty
		if (event.charCode == 13 && messageSpace.value != ''){
			socket.emit('clientMsg', {msg: messageSpace.value});
			messageSpace.value = '';
		}

	});

	// click listener for sending request to /logout page
	btn.addEventListener('click', function() {
		location.replace('http://192.168.8.101:3000/logout');
	});


};

