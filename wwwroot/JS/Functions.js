/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetAttributeId: () => (/* binding */ GetAttributeId),
/* harmony export */   StringToElement: () => (/* binding */ StringToElement),
/* harmony export */   StringToElements: () => (/* binding */ StringToElements),
/* harmony export */   TypedEventEmitter: () => (/* binding */ TypedEventEmitter),
/* harmony export */   delay: () => (/* binding */ delay)
/* harmony export */ });
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class TypedEventEmitter {
    Events = new Map();
    On = (event, callback) => {
        if (!this.Events.has(event)) {
            this.Events.set(event, []);
        }
        this.Events.get(event).push(callback);
    };
    Off = (event, callback) => {
        if (this.Events.has(event)) {
            this.Events.set(event, this.Events.get(event).filter((cb) => cb !== callback));
        }
    };
    Emit = (event, payload) => {
        this.Events.get(event)?.forEach((cb) => cb(payload));
    };
}
function GetAttributeId(el, attributeName) {
    el = el instanceof HTMLElement ? [el] : Array.from(el);
    let ids = new Set();
    for (const element of el) {
        const idsAttribute = element.getAttribute(attributeName);
        element.removeAttribute(attributeName);
        const IDS = idsAttribute?.startsWith("[") ? JSON.parse(idsAttribute) : idsAttribute ? [Number(idsAttribute)] : [];
        IDS.forEach((id) => ids.add(id));
    }
    return ids;
}
function StringToElement(string) {
    let tempParent = document.createElement("div");
    tempParent.innerHTML = string.trim();
    return tempParent.firstChild;
}
function StringToElements(string) {
    let tempParent = document.createElement("div");
    tempParent.innerHTML = string.trim();
    return tempParent.children;
}

/******/ })()
;