var singleChatNumber = 0;

var library = {
   
	// create and return a html element given the string name of that element, its parrent element and text string	
	createHTML(newElem, parentElem, txt) {
		let newEl = document.createElement(newElem);
		if (txt) {
			let txtNode = document.createTextNode(txt);
			newEl.appendChild(txtNode);
		}
		parentElem.appendChild(newEl);
		return newEl;
	},

	// set the wanted attribute to the given html element
	appendAttr(el, attrName, attrVal) {
		let attributeName = document.createAttribute(attrName);
		attributeName.value = attrVal;
		el.setAttributeNode(attributeName);
	},

	createSingleChat(mainDiv, talkToPerson) {
		let singleChat = this.createHTML('div', mainDiv, '');
		this.appendAttr(singleChat, 'class', 'singleChat');
		this.appendAttr(singleChat, 'style', 'left:' + 240 * singleChatNumber++ + 'px');
		let singleChatTopBar = this.createHTML('div', singleChat, '');
		this.appendAttr(singleChatTopBar, 'class', 'singleChatTopBar');
		let singleChatLabel = this.createHTML('span', singleChatTopBar, talkToPerson);
		this.appendAttr(singleChatLabel, 'class', 'singleChatLabel');
		let minimizeBtn = this.createHTML('img', singleChatTopBar, '');
		this.appendAttr(minimizeBtn, 'class', 'minimizeBtn');
		minimizeBtn.src = '/images/minimize_window.png';
		let closeBtn = this.createHTML('img', singleChatTopBar, '');
		this.appendAttr(closeBtn, 'class', 'closeBtn');
		closeBtn.src = '/images/close_window.png';
		let singleMessageSpace = this.createHTML('input', singleChat, '');
		this.appendAttr(singleMessageSpace, 'class', 'singleMessageSpace');
		singleMessageSpace.type = 'text';
		singleMessageSpace.placeholder = 'Say something...';
		singleMessageSpace.name = 'singleMessageSpace';
	}

};


module.exports = library;
