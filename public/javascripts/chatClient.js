var socket = require('socket.io-client')('http://192.168.8.101:4000'); // get the socket object and connect to server
var creator = require('./createHtml'); // get the html creation library
var mainDiv,chatSpace, messageSpace, usersSpace, btn, clientName;


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

function writeMessage(data, writeLocation) {
	let renderedMsg = (data.name == clientName ? 'You said' : data.name + ' said') + ':\n' + data.msg;
	let leftOrRight = data.name == clientName ? 'msgRight' : 'msgLeft';
	let newEl = creator.createHTML('p', writeLocation, renderedMsg);
	creator.appendAttr(newEl, 'class', leftOrRight);
}


window.onload = () => {
	
	mainDiv = document.getElementById('main');
	chatSpace = document.getElementById('chatSpace');
	messageSpace = document.getElementById('messageSpace');
	usersSpace = document.getElementById('usersDiv');
	btn = document.getElementById('btn');
	clientName = document.getElementById('clientName').innerHTML;
	
	messageSpace.focus();
	
	// emit this event to obtain active users
	socket.emit('userPageRefreshed', {name: clientName});
	// calculate max number of single chats
	creator.singleChatMax = Math.floor(window.innerWidth / 240);
	
	// start listening for chat messages coming from socket server (serverMsg event) via broadcasting
	socket.on('serverMsgGroup', data => {
		writeMessage(data, chatSpace);
		// set automatic scrolldown of the scrollbar
		chatSpace.scrollTop = chatSpace.scrollHeight;
	});

	// start listening for chat messages coming from socket server but specifically to this user
	socket.on('serverMsgSingle', data => {
		let whereToWrite = data.name === clientName ? data.to : data.name;
		let singleChat = document.getElementById(whereToWrite);
		// ensure that single chat pops up if it isn't already open
		if (!singleChat) {
			creator.createSingleChat(usersSpace, whereToWrite, socket, clientName);
			singleChat = document.getElementById(whereToWrite);
		}
		let singleChatSpace = singleChat.querySelector('div.singleChatSpace');
		writeMessage(data, singleChatSpace);
		singleChatSpace.scrollTop = singleChatSpace.scrollHeight;
	});

	// take action when this signal arrives from io-server and update chat history with given data
	socket.on('updateChatHistory', dataArr => {
		dataArr.forEach(element => writeMessage(element, chatSpace));
		chatSpace.scrollTop = chatSpace.scrollHeight;
	});

	// take action when this signal arrives from io-server and update active users list with given data
	socket.on('updateUserList', data => {
		let users = Array.from(document.getElementsByClassName('activeUsersName'));
		// adds new users that don't exist on active users list
		data.sessions.forEach(elementString => {
			let element = JSON.parse(elementString);
			if (!users.some(item => element.name === item.innerHTML)) {
				creator.populateActiveUser(element, usersSpace, socket, clientName);
			}
		});
		// removes users that don't exist on newly arrived list (data.sessions) and removes them from active users list
		users = Array.from(document.getElementsByClassName('activeUsersName'));
		users.forEach(item => {
			if (!data.sessions.some(elementString => item.innerHTML === JSON.parse(elementString).name)) {
				item.parentNode.remove();
				let chatToDelete = document.getElementById(item.innerHTML);
				if (chatToDelete) chatToDelete.remove();
				self.singleChatNumber = 0;
				Array
				.from(document.getElementsByClassName('singleChatTopBar'))
				.forEach(element => element.parentNode.style.left = 240 * self.singleChatNumber++ + 'px');
			}
		});
	});

	// start listening for enter keypress
	document.addEventListener('keydown', event => {
		// emit clientMsg event and send chat message to socket server if enter was pressed and message box isn't empty
		if (messageSpace === document.activeElement) {
			if (event.key == 'Enter' && messageSpace.value != ''){
				socket.emit('clientMsgGroup', {name: clientName, msg: messageSpace.value});
				messageSpace.value = '';
			}
			actionTracker.isActive = true;
		}
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
