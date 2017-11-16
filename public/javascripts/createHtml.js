module.exports = {
    
	createHTML (newElem,parentElem,txt) {
		var newEl = document.createElement(newElem);
		var txtNode = document.createTextNode(txt);
		newEl.appendChild(txtNode);
		parentElem.appendChild(newEl);

		return newEl;
	},

	appendAttr (el,attrName,attrVal) {
		var attributeName = document.createAttribute(attrName);
		attributeName.value = attrVal;
		el.setAttributeNode(attributeName);
	}

};
