
var library = {

	// counter for single chats
	singleChatNumber: 0,

	// max number of chats based on window width
	singleChatMax: 6,

	// create and return a html element given the string name of that element, its parrent element and text string	
	createHTML(newElem, parentElem, txt, replaceableElem) {
		let newElemCreated = document.createElement(newElem);
		if (txt) {
			let txtNode = document.createTextNode(txt);
			newElemCreated.appendChild(txtNode);
		}
		if (replaceableElem) parentElem.replaceChild(newElemCreated, replaceableElem);
		else parentElem.appendChild(newElemCreated);
		return newElemCreated;
	},

	// set the wanted attribute to the given html element
	appendAttr(el, attrName, attrVal) {
		el.setAttribute(attrName, attrVal);
	},

	// dynamically create single chat with classes from chat.css file
	createSingleChat(mainDiv, talkToPerson) {
		let self = this;
		let singleChatList = document.getElementsByClassName('singleChatTopBar');
		// start from beginning when whole window width is filled with chats
		if (this.singleChatNumber >= this.singleChatMax) this.singleChatNumber = 0;
		// boilerplate for single chat
		let replaceableElem = this.singleChatNumber in singleChatList ? singleChatList[this.singleChatNumber].parentNode : null;
		let singleChat = this.createHTML('div', mainDiv, '', replaceableElem);
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
		let singleMessageSpace = this.createHTML('input', singleChat, '');
		this.appendAttr(singleMessageSpace, 'class', 'singleMessageSpace');
		singleMessageSpace.type = 'text';
		singleMessageSpace.placeholder = 'Say something...';
		singleMessageSpace.name = 'singleMessageSpace';
	}

};


module.exports = library;
