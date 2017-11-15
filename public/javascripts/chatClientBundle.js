/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var creator = __webpack_require__(1);

window.onload = () => {

    var socket = io('http://localhost:4000');
    var chatSpace = document.getElementById('chatSpace');
    var messageSpace = document.getElementById('messageSpace');

    socket.on('serverMsg', (data) => {
        let newEl = creator.createHTML('p', chatSpace, data.msg);
        creator.appendAttr(newEl, 'class', 'msgRight');
        chatSpace.scrollTop = chatSpace.scrollHeight;
    })

    document.addEventListener('keypress', (event) => {
        if (event.charCode == 13 && messageSpace.value != ''){
            socket.emit('clientMsg', {msg: messageSpace.value});
            messageSpace.value = '';
        }
    })

}



/***/ }),
/* 1 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);