var socket = require('socket.io-client')('http://192.168.8.101:4000'); // get the socket object and connect to server
var creator = require('./createHtml'); // get the html creation library
var mainDiv,chatSpace, messageSpace, usersSpace, btn, yourName;


let actionTracker = {
	isActive: true,
	shouldSend() {
		if (this.isActive) this.send();
	},
	send() {
		this.isActive = false;
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', 'http://192.168.8.101:3000/touch');
		xmlhttp.send();
	}
};

function writeMessage(data) {
	let renderedMsg = (data.name == yourName ? 'You said' : data.name + ' said') + ':\n' + data.msg;
	let leftOrRight = data.name == yourName ? 'msgRight' : 'msgLeft';
	let newEl = creator.createHTML('p', chatSpace, renderedMsg);
	creator.appendAttr(newEl, 'class', leftOrRight);
}


window.onload = () => {
	
	mainDiv = document.getElementById('main');
	chatSpace = document.getElementById('chatSpace');
	messageSpace = document.getElementById('messageSpace');
	usersSpace = document.getElementById('usersDiv');
	btn = document.getElementById('btn');
	yourName = document.getElementById('yourName').innerHTML;
	
	// emit this event to obtain active users
	socket.emit('userPageRefreshed');
	// calculate max number of single chats
	creator.singleChatMax = Math.floor(window.innerWidth / 240);
	
	// start listening for chat messages coming from socket server (serverMsg event) via broadcasting
	socket.on('serverMsg', data => {
		writeMessage(data);
		// set automatic scrolldown of the scrollbar
		chatSpace.scrollTop = chatSpace.scrollHeight;
	});

	// take action when this signal arrives from io-server and update chat history with given data
	socket.on('updateChatHistory', dataArr => {
		dataArr.forEach(element => writeMessage(element));
		chatSpace.scrollTop = chatSpace.scrollHeight;
	});

	// take action when this signal arrives from io-server and update active users list with given data
	socket.on('updateUserList', data => {
		usersSpace.innerHTML = '';
		data.sessions.forEach(element => {
			let newDiv = creator.createHTML('div', usersSpace, '');
			creator.appendAttr(newDiv, 'class', 'users');
			let newImg = creator.createHTML('img', newDiv, null);
			creator.appendAttr(newImg, 'class', 'activeUsersPic');
			newImg.src = element.image;
			let newName = creator.createHTML('p', newDiv, element.name);
			creator.appendAttr(newName, 'class', 'activeUsersName');
		});
	});

	// start listening for enter keypress
	document.addEventListener('keydown', event => {
		// emit clientMsg event and send chat message to socket server if enter was pressed and message box isn't empty 
		if (event.key == 'Enter' && messageSpace.value != ''){
			socket.emit('clientMsg', {name: yourName, msg: messageSpace.value});
			messageSpace.value = '';
		}
		actionTracker.isActive = true;
		creator.createSingleChat(mainDiv, Math.random());
	});

	// set the variable for maximum number of single chats when the screen is resized
	// delete element that end up out of viewport
	window.addEventListener('resize', function() {
		let singleChatList = document.getElementsByClassName('singleChatTopBar');
		creator.singleChatMax = Math.floor(window.innerWidth / 240);
		Array
			.from(singleChatList)
			.forEach((element, index) => {if (index >= creator.singleChatMax) element.parentNode.remove();});
		if (singleChatList.length < creator.singleChatMax) creator.singleChatNumber = singleChatList.length;
	});

	// click listener for sending request to /logout page
	btn.addEventListener('click', function() {
		location.replace('http://192.168.8.101:3000/logout');
	});

	// check for keyboard activity every 5min. and ask for touch if user is active
	setInterval(() => actionTracker.shouldSend(), 5000);

};
