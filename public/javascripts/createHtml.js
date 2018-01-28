var library = {
   
	// create and return a html element given the string name of that element, its parrent element and text string	
	createHTML(newElem,parentElem,txt) {
		let newEl = document.createElement(newElem);
		let txtNode = document.createTextNode(txt);
		newEl.appendChild(txtNode);
		parentElem.appendChild(newEl);
		return newEl;
	},

	// set the wanted attribute to the given html element
	appendAttr(el,attrName,attrVal) {
		let attributeName = document.createAttribute(attrName);
		attributeName.value = attrVal;
		el.setAttributeNode(attributeName);
	}

};


module.exports = library;
