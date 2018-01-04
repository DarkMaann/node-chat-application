module.exports = {
   
	// create and return a html element given the string name of that element, its parrent element and text string	
	createHTML(newElem,parentElem,txt) {
		var newEl = document.createElement(newElem);
		var txtNode = document.createTextNode(txt);
		newEl.appendChild(txtNode);
		parentElem.appendChild(newEl);

		return newEl;
	},

	// set the wanted attribute to given html element
	appendAttr(el,attrName,attrVal) {
		var attributeName = document.createAttribute(attrName);
		attributeName.value = attrVal;
		el.setAttributeNode(attributeName);
	}

	
};
