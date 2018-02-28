
var library = {

	// counter for single chats
	singleChatNumber: 0,

	// max number of chats based on window width
	singleChatMax: 6,

	// create and return a html element given the string name of that element, its parrent element and text string	
	createHTML(newElem, parentElem, txt, replaceableElem) {
		let newElemCreated = document.createElement(newElem);
		if (txt) {
			newElemCreated.appendChild(document.createTextNode(txt));
		}
		if (replaceableElem) parentElem.replaceChild(newElemCreated, replaceableElem);
		else parentElem.appendChild(newElemCreated);
		return newElemCreated;
	},

	// set the wanted attribute to the given html element
	appendAttr(el, attrName, attrVal) {
		el.setAttribute(attrName, attrVal);
	},

	// dynamically create active-users list with classes and effects form chat.css file
		populateActiveUser(user, parentElem, socket, hostName) {
		let self = this;
		let newDiv = this.createHTML('div', parentElem, '');
		this.appendAttr(newDiv, 'class', 'users');
		let newImg = this.createHTML('img', newDiv, null);
		this.appendAttr(newImg, 'class', 'activeUsersPic');
		newImg.src = user.image;
		let newName = this.createHTML('p', newDiv, user.name);
		this.appendAttr(newName, 'class', 'activeUsersName');
		newDiv.addEventListener('click', function(ev) {
			let alreadyOpen = false;
			Array
				.from(document.getElementsByClassName('singleChatTopBar'))
				.forEach(item => {
					if (item.firstElementChild.textContent === user.name) {
						// maximize existing single chat and highligh it
						item.parentNode.className = 'singleChat';
						item.style.animationName = 'lightUp';
						setTimeout(() => item.style.animationName = 'none', 300);
						alreadyOpen = true;
						return;
					};
				});
			if (!alreadyOpen) self.createSingleChat(parentElem, user.name, socket, hostName);
		});
	},

	// dynamically create single chat with classes from chat.css file
	createSingleChat(mainDiv, talkToPerson, socket, hostName) {
		let self = this;
		let singleChatList = document.getElementsByClassName('singleChatTopBar');
		// start from beginning when whole window width is filled with chats
		if (this.singleChatNumber >= this.singleChatMax) this.singleChatNumber = 0;
		// boilerplate for single chat
		let replaceableElem = this.singleChatNumber in singleChatList ? singleChatList[this.singleChatNumber].parentNode : null;
		let singleChat = this.createHTML('div', mainDiv, '', replaceableElem);
		this.appendAttr(singleChat, 'id', talkToPerson);
		this.appendAttr(singleChat, 'class', 'singleChat');
		this.appendAttr(singleChat, 'style', 'left:' + 240 * this.singleChatNumber++ + 'px');
		let singleChatTopBar = this.createHTML('div', singleChat, '');
		this.appendAttr(singleChatTopBar, 'class', 'singleChatTopBar');
		let singleChatLabel = this.createHTML('span', singleChatTopBar, talkToPerson);
		this.appendAttr(singleChatLabel, 'class', 'singleChatLabel');
		let minimizeBtn = this.createHTML('img', singleChatTopBar, '');
		this.appendAttr(minimizeBtn, 'class', 'minimizeBtn');
		minimizeBtn.src = '/images/minimize_window.png';
		minimizeBtn.addEventListener('click', function(ev) {
			this.parentNode.parentNode.className = 'singleChatMinimized';
			ev.stopPropagation();
			singleChatTopBar.addEventListener('click', function minimize() {
				this.parentNode.className = 'singleChat';
				this.removeEventListener('click', minimize);
			});
		});
		let closeBtn = this.createHTML('img', singleChatTopBar, '');
		this.appendAttr(closeBtn, 'class', 'closeBtn');
		closeBtn.addEventListener('click', function(ev) {
			this.parentNode.parentNode.remove();
			self.singleChatNumber = 0;
			Array
				.from(document.getElementsByClassName('singleChatTopBar'))
				.forEach(element => element.parentNode.style.left = 240 * self.singleChatNumber++ + 'px');
		});
		closeBtn.src = '/images/close_window.png';
		let singleChatSpace = this.createHTML('div', singleChat, '');
		this.appendAttr(singleChatSpace, 'class', 'singleChatSpace');
		let singleMessageSpace = this.createHTML('input', singleChat, '');
		this.appendAttr(singleMessageSpace, 'class', 'singleMessageSpace');
		singleMessageSpace.focus();
		// add listener for pressing enter, i.e. sending single message to certain user
		singleMessageSpace.addEventListener('keydown', function(ev) {
			if (ev.key === 'Enter' && this.value !== '') {
				socket.emit('clientMsgSingle', {name: hostName, to: talkToPerson, msg: this.value});
				this.value = '';
			}
		});
		singleMessageSpace.type = 'text';
		singleMessageSpace.placeholder = 'Say something...';
		singleMessageSpace.name = 'singleMessageSpace';
		let smileySpace = this.createHTML('div', singleChat, '');
		this.enableSmileys(singleMessageSpace, smileySpace);
		socket.emit('giveSingleChatHistory', {from: hostName, to: talkToPerson});
	},

	enableSmileys(messageSpace, smileySpace, width = '6%') {
		smileySpace.innerHTML = '<span>\u{1f600}</span>';
		smileySpace.addEventListener('click', function openey(evt) {
			this.style.width = '96%';
			this.textContent = '';
			this.innerHTML = `<span>\u{1f600}</span>
							  <span>\u{1f602}</span>
							  <span>\u{1f609}</span>
							  <span>\u{1f60A}</span>
							  <span>\u{1f610}</span>
							  <span>\u{1f62B}</span>
							  <span>\u{1f615}</span>
							  <span>\u{1f614}</span>
							  <span>\u{1f61E}</span>
							  <span>\u{1f631}</span>
							  <span class='arrow'>\u{27A1}</span>`;
			let spanArray = [...this.querySelectorAll('span')];
			spanArray.forEach(item => {
				item.addEventListener('click', function closey(evt) {
					evt.stopPropagation();
					if (item.textContent !== '\u{27A1}') messageSpace.value += item.textContent;
					smileySpace.style.width = width;
					smileySpace.innerHTML = '\u{1f600}';
					spanArray.forEach(item => item.removeEventListener('click', closey));
					smileySpace.addEventListener('click', openey);
					messageSpace.focus();
				});
			});
			smileySpace.removeEventListener('click', openey);
		});
		this.appendAttr(smileySpace, 'class', 'smileySpace');
	}
};


module.exports = library;
