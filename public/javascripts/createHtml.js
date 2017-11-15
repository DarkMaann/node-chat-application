module.exports = {
    
    createHTML (newEl,parEl,txt) {
        var newEl = document.createElement(newEl);
        var txtNode = document.createTextNode(txt);
        newEl.appendChild(txtNode);
        parEl.appendChild(newEl);

        return newEl;
    },

    appendAttr (el,attrName,attrVal) {
        var attrName = document.createAttribute(attrName);
        attrName.value = attrVal;
        el.setAttributeNode(attrName);
    }

}
