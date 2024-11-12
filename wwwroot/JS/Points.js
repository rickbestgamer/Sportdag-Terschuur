/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RGBAnimation: () => (/* binding */ RGBAnimation)
/* harmony export */ });
/* harmony import */ var _Animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

class RGBAnimation {
    RAnimation;
    GAnimation;
    BAnimation;
    R;
    G;
    B;
    constructor(duration, sColor, eColor) {
        this.RAnimation = new _Animations__WEBPACK_IMPORTED_MODULE_0__.CustomAnimation(duration);
        this.GAnimation = new _Animations__WEBPACK_IMPORTED_MODULE_0__.CustomAnimation(duration);
        this.BAnimation = new _Animations__WEBPACK_IMPORTED_MODULE_0__.CustomAnimation(duration);
        const oColor = this.parseColor(sColor);
        const fColor = this.parseColor(eColor);
        this.R = oColor[0];
        this.RAnimation.addKeyFrame(0, oColor[0]);
        this.RAnimation.addKeyFrame(1, fColor[0]);
        this.G = oColor[1];
        this.GAnimation.addKeyFrame(0, oColor[1]);
        this.GAnimation.addKeyFrame(1, fColor[1]);
        this.B = oColor[2];
        this.BAnimation.addKeyFrame(0, oColor[2]);
        this.BAnimation.addKeyFrame(1, fColor[2]);
    }
    parseColor(color) {
        const ctxC = document.createElement("canvas").getContext("2d");
        ctxC.fillStyle = color;
        const computedColor = ctxC.fillStyle;
        let rgb;
        if (computedColor.startsWith("#")) {
            let hex = computedColor.slice(1);
            if (hex.length === 3) {
                hex = hex
                    .split("")
                    .map((h) => h + h)
                    .join("");
            }
            rgb = [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
        }
        else {
            rgb = computedColor.match(/\d+/g).map(Number);
        }
        return rgb;
    }
    Animate() {
        this.RAnimation.stopAnimation();
        this.RAnimation.startAnimation((color) => {
            this.R = color;
        });
        this.GAnimation.stopAnimation();
        this.GAnimation.startAnimation((color) => {
            this.G = color;
        });
        this.BAnimation.stopAnimation();
        this.BAnimation.startAnimation((color) => {
            this.B = color;
        });
    }
    ReverseAnimate() {
        this.RAnimation.stopAnimation();
        this.RAnimation.reverseAnimation((color) => {
            this.R = color;
        });
        this.GAnimation.stopAnimation();
        this.GAnimation.reverseAnimation((color) => {
            this.G = color;
        });
        this.BAnimation.stopAnimation();
        this.BAnimation.reverseAnimation((color) => {
            this.B = color;
        });
    }
    SetEasingFunction(easingFunction) {
        this.RAnimation.SetEasingFunction(easingFunction);
        this.GAnimation.SetEasingFunction(easingFunction);
        this.BAnimation.SetEasingFunction(easingFunction);
    }
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomAnimation: () => (/* binding */ CustomAnimation)
/* harmony export */ });
class CustomAnimation {
    constructor(duration) {
        this.Duration = duration;
        this.KeyFrames = [];
        this.EasingFunction = (t) => t;
        this.AnimationProgress = 0;
        this.AnimationFrame = 0;
    }
    Duration;
    KeyFrames;
    EasingFunction;
    AnimationProgress;
    AnimationFrame;
    static AnimationKeyframes = class AnimationKeyframes {
        KeyTime;
        Value;
        constructor(keyTime, value) {
            this.KeyTime = keyTime;
            this.Value = value;
        }
    };
    addKeyFrame(keyTime, value) {
        this.KeyFrames.push(new CustomAnimation.AnimationKeyframes(keyTime, value));
        this.KeyFrames.sort((a, b) => a.KeyTime - b.KeyTime);
    }
    animate(drawCallback, isReversed) {
        const start = performance.now();
        const initialProgress = this.AnimationProgress;
        const animate = () => {
            const elapsedTime = performance.now() - start;
            let progress = isReversed ? Math.max(initialProgress - elapsedTime / this.Duration, 0) : Math.min(initialProgress + elapsedTime / this.Duration, 1);
            if (isReversed ? progress > 0 : progress < 1) {
                const easedProgress = this.EasingFunction(progress);
                const animatedValue = this.calculateAnimatedValue(easedProgress);
                drawCallback(animatedValue);
                this.AnimationProgress = progress;
                this.AnimationFrame = requestAnimationFrame(animate);
            }
        };
        this.AnimationFrame = requestAnimationFrame(animate);
    }
    startAnimation(drawCallback) {
        this.animate(drawCallback, false);
    }
    reverseAnimation(drawCallback) {
        this.animate(drawCallback, true);
    }
    stopAnimation() {
        cancelAnimationFrame(this.AnimationFrame);
    }
    calculateAnimatedValue(progress) {
        const keyFrames = this.KeyFrames;
        const keyFrame = keyFrames.find((kf) => kf.KeyTime >= progress);
        if (!keyFrame) {
            return this.KeyFrames[0].Value;
        }
        else if (keyFrame.KeyTime == progress) {
            return keyFrame.Value;
        }
        else {
            const prevKeyFrame = keyFrames[keyFrames.indexOf(keyFrame) - 1];
            return prevKeyFrame.Value + (keyFrame.Value - prevKeyFrame.Value) * (progress - prevKeyFrame.KeyTime);
        }
    }
    SetEasingFunction(easingFunction) {
        this.EasingFunction = easingFunction;
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/* harmony export */   Point: () => (/* binding */ Point)
/* harmony export */ });
/* harmony import */ var _Animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _RGBAnimation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


// export class Points {
// 	constructor() {
// 		this.points = [];
// 	}
// 	points: Point[];
// 	Add(x: number, y: number, label: string): void;
// 	Add(x: number, y: number, label: string, easingFunction: (t: number) => number): void;
// 	Add(x: number, y: number, label: string, easingFunction?: (t: number) => number): void {
// 		const point: Point = new Point(x, y, label);
// 		if (easingFunction !== undefined) {
// 			point.SetEasingFunction(easingFunction);
// 		}
// 		this.points.push(point);
// 	}
// }
class Point {
    PosX;
    PosY;
    ID;
    Label;
    Type;
    Hovered;
    Dragging;
    CColor;
    CSize;
    RGBAnimation;
    SizeAnimation;
    constructor(label, type, easingFunction, x, y, id, dragging) {
        const duration = 300;
        const InitialSize = 12;
        this.PosX = x;
        this.PosY = y;
        this.ID = id;
        this.Label = label;
        this.Type = type;
        this.Hovered = false;
        if (dragging) {
            this.Dragging = dragging;
        }
        else {
            this.Dragging = false;
        }
        this.CColor = "red";
        this.CSize = InitialSize;
        this.RGBAnimation = new _RGBAnimation__WEBPACK_IMPORTED_MODULE_1__.RGBAnimation(duration, "red", "blue");
        this.SizeAnimation = new _Animations__WEBPACK_IMPORTED_MODULE_0__.CustomAnimation(duration);
        this.SizeAnimation.addKeyFrame(0, InitialSize);
        this.SizeAnimation.addKeyFrame(1, InitialSize * 2);
        if (easingFunction !== undefined) {
            this.SetEasingFunction(easingFunction);
        }
    }
    Animate() {
        this.RGBAnimation.Animate();
        this.SizeAnimation.stopAnimation();
        this.SizeAnimation.startAnimation((size) => {
            this.CSize = size;
        });
    }
    ReverseAnimate() {
        this.RGBAnimation.ReverseAnimate();
        this.SizeAnimation.stopAnimation();
        this.SizeAnimation.reverseAnimation((size) => {
            this.CSize = size;
        });
    }
    SetEasingFunction(easingFunction) {
        this.SizeAnimation.SetEasingFunction(easingFunction);
    }
}

/******/ })()
;