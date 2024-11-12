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

/******/ })()
;