var creator = require('./createHtml');

window.onload = () => {

	var socket = io('http://localhost:4000');
	var chatSpace = document.getElementById('chatSpace');
	var messageSpace = document.getElementById('messageSpace');

	socket.on('serverMsg', (data) => {
		let newEl = creator.createHTML('p', chatSpace, data.msg);
		creator.appendAttr(newEl, 'class', 'msgRight');
		chatSpace.scrollTop = chatSpace.scrollHeight;
	});

	document.addEventListener('keypress', (event) => {
		if (event.charCode == 13 && messageSpace.value != ''){
			socket.emit('clientMsg', {msg: messageSpace.value});
			messageSpace.value = '';
		}
	});

};

