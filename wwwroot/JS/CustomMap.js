/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 73:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomMapMouseHandler: () => (/* binding */ CustomMapMouseHandler),
/* harmony export */   CustomMapTouchHandler: () => (/* binding */ CustomMapTouchHandler)
/* harmony export */ });
class CustomMapMouseHandler {
    DragStartX = 0;
    DragStartY = 0;
    IsDragging = false;
    Map;
    constructor(map) {
        this.Map = map;
    }
    MouseDown(e) {
        this.IsDragging = true;
        this.DragStartX = e.clientX - this.Map.ImgX;
        this.DragStartY = e.clientY - this.Map.ImgY;
        this.Map.Points.forEach((point) => {
            if (point.Hovered) {
                this.IsDragging = false;
                point.Dragging = true;
            }
        });
        if (this.Map.NewPoint) {
            this.Map.NewPoint.Dragging = false;
            this.Map.Points.push(this.Map.NewPoint);
            this.Map.NewPoint = undefined;
        }
    }
    MouseLeave(e) {
        this.IsDragging = false;
        this.Map.Points.forEach((point) => {
            point.Dragging = false;
            point.Hovered = false;
            point.ReverseAnimate();
        });
    }
    MouseMove(e) {
        const rect = this.Map.Canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.Map.ImgX) / this.Map.ImgScale;
        const mouseY = (e.clientY - rect.top - this.Map.ImgY) / this.Map.ImgScale;
        const pointsToMove = [];
        let isDraggingPoint = false;
        let isHoveringPoint = false;
        this.Map.Points.forEach((point) => {
            if (point.PosX == undefined || point.PosY == undefined)
                return;
            if (!isDraggingPoint) {
                const distance = Math.sqrt((mouseX - point.PosX) ** 2 + (mouseY - point.PosY) ** 2);
                if ((distance < point.CSize / this.Map.ImgScale && !isHoveringPoint && !point.Hovered) || point.Dragging) {
                    isHoveringPoint = true;
                    point.Hovered = true;
                    point.Animate();
                }
                else if ((distance > point.CSize / this.Map.ImgScale && point.Hovered && !point.Dragging) || isHoveringPoint) {
                    point.Hovered = false;
                    point.ReverseAnimate();
                }
                if (point.Hovered) {
                    isHoveringPoint = true;
                }
            }
            if (point.Dragging && !isDraggingPoint) {
                isDraggingPoint = true;
                point.PosX = Math.max(-this.Map.Image.width / 2, Math.min(mouseX, this.Map.Image.width / 2));
                point.PosY = Math.max(-this.Map.Image.height / 2, Math.min(mouseY, this.Map.Image.height / 2));
                pointsToMove.push(point);
            }
            this.Map.Points = this.Map.Points.filter((point) => !pointsToMove.includes(point));
            this.Map.Points.unshift(...pointsToMove);
        });
        if (this.IsDragging) {
            this.Map.ImgX = this.Map.Image.width * this.Map.ImgScale > this.Map.CanvasWidth ? Math.min(Math.max(e.clientX - this.DragStartX, this.Map.CanvasWidth - (this.Map.Image.width / 2) * this.Map.ImgScale), (this.Map.Image.width / 2) * this.Map.ImgScale) : this.Map.CanvasWidth / 2;
            this.Map.ImgY = this.Map.Image.height * this.Map.ImgScale > this.Map.CanvasHeight ? Math.min(Math.max(e.clientY - this.DragStartY, this.Map.CanvasHeight - (this.Map.Image.height / 2) * this.Map.ImgScale), (this.Map.Image.height / 2) * this.Map.ImgScale) : this.Map.CanvasHeight / 2;
        }
        if (this.Map.NewPoint) {
            if (this.Map.NewPoint.Dragging && !isDraggingPoint) {
                isDraggingPoint = true;
                this.Map.NewPoint.PosX = Math.max(-this.Map.Image.width / 2, Math.min(mouseX, this.Map.Image.width / 2));
                this.Map.NewPoint.PosY = Math.max(-this.Map.Image.height / 2, Math.min(mouseY, this.Map.Image.height / 2));
            }
        }
    }
    MouseUp() {
        this.IsDragging = false;
        this.Map.Points.forEach((point) => {
            this.IsDragging = false;
            point.Dragging = false;
        });
    }
    Wheel(e) {
        e.preventDefault();
        const mouseX = e.clientX - this.Map.Canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - this.Map.Canvas.getBoundingClientRect().top;
        const scaleX = this.Map.Canvas.width / this.Map.Image.width;
        const scaleY = this.Map.Canvas.height / this.Map.Image.height;
        const scaleAmount = -e.deltaY * 0.001;
        const prevImgScale = this.Map.ImgScale;
        this.Map.ImgScale += scaleAmount;
        this.Map.ImgScale = Math.min(Math.max(Math.min(scaleX, scaleY), this.Map.ImgScale), 3);
        const scaleFactorX = this.Map.ImgScale / prevImgScale;
        const scaleFactorY = this.Map.ImgScale / prevImgScale;
        this.Map.ImgX = this.Map.Image.width * this.Map.ImgScale > this.Map.CanvasWidth ? Math.min(Math.max(mouseX - (mouseX - this.Map.ImgX) * scaleFactorX, this.Map.CanvasWidth - (this.Map.Image.width / 2) * this.Map.ImgScale), (this.Map.Image.width / 2) * this.Map.ImgScale) : this.Map.CanvasWidth / 2;
        this.Map.ImgY = this.Map.Image.height * this.Map.ImgScale > this.Map.CanvasHeight ? Math.min(Math.max(mouseY - (mouseY - this.Map.ImgY) * scaleFactorY, this.Map.CanvasHeight - (this.Map.Image.height / 2) * this.Map.ImgScale), (this.Map.Image.height / 2) * this.Map.ImgScale) : this.Map.CanvasHeight / 2;
    }
}
class CustomMapTouchHandler {
    Map;
    dragStartX = 0;
    dragStartY = 0;
    isDragging = false;
    initialDistance = null;
    initialScale = null;
    constructor(map) {
        this.Map = map;
    }
    TouchCancel(e) {
        this.isDragging = false;
        this.initialDistance = null;
        this.initialScale = null;
    }
    TouchEnd(e) {
        if (e.touches.length < 2) {
            this.isDragging = false;
        }
        if (e.touches.length === 0) {
            this.isDragging = false;
            this.Map.Points.forEach((point) => {
                this.isDragging = false;
                point.Dragging = false;
            });
        }
    }
    TouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 2 && this.initialDistance !== null && this.initialScale !== null) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const newDistance = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2));
            const scaleAmount = newDistance / this.initialDistance;
            const prevImgScale = this.Map.ImgScale;
            const scaleX = this.Map.Canvas.width / this.Map.Image.width;
            const scaleY = this.Map.Canvas.height / this.Map.Image.height;
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;
            const rect = this.Map.Canvas.getBoundingClientRect();
            const mouseX = centerX - rect.left;
            const mouseY = centerY - rect.top;
            this.Map.ImgScale = this.initialScale * scaleAmount;
            this.Map.ImgScale = Math.min(Math.max(Math.min(scaleX, scaleY), this.Map.ImgScale), 3);
            const scaleFactorX = this.Map.ImgScale / prevImgScale;
            const scaleFactorY = this.Map.ImgScale / prevImgScale;
            this.Map.ImgX = this.Map.Image.width * this.Map.ImgScale > this.Map.CanvasWidth ? Math.min(Math.max(mouseX - (mouseX - this.Map.ImgX) * scaleFactorX, this.Map.CanvasWidth - (this.Map.Image.width / 2) * this.Map.ImgScale), (this.Map.Image.width / 2) * this.Map.ImgScale) : this.Map.CanvasWidth / 2;
            this.Map.ImgY = this.Map.Image.height * this.Map.ImgScale > this.Map.CanvasHeight ? Math.min(Math.max(mouseY - (mouseY - this.Map.ImgY) * scaleFactorY, this.Map.CanvasHeight - (this.Map.Image.height / 2) * this.Map.ImgScale), (this.Map.Image.height / 2) * this.Map.ImgScale) : this.Map.CanvasHeight / 2;
        }
        else if (e.touches.length === 1 && this.isDragging) {
            const touch = e.touches[0];
            const rect = this.Map.Canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left - this.Map.ImgX) / this.Map.ImgScale;
            const touchY = (touch.clientY - rect.top - this.Map.ImgY) / this.Map.ImgScale;
            let isDraggingPoint = false;
            this.Map.Points.forEach((point) => {
                if (point.PosX == undefined || point.PosY == undefined)
                    return;
                if (point.Dragging && !isDraggingPoint) {
                    isDraggingPoint = true;
                    point.PosX = Math.max(-this.Map.Image.width / 2, Math.min(touchX, this.Map.Image.width / 2));
                    point.PosY = Math.max(-this.Map.Image.height / 2, Math.min(touchY, this.Map.Image.height / 2));
                }
            });
            if (!isDraggingPoint) {
                this.Map.ImgX = this.Map.Image.width * this.Map.ImgScale > this.Map.CanvasWidth ? Math.min(Math.max(touch.clientX - this.dragStartX, this.Map.CanvasWidth - (this.Map.Image.width / 2) * this.Map.ImgScale), (this.Map.Image.width / 2) * this.Map.ImgScale) : this.Map.CanvasWidth / 2;
                this.Map.ImgY = this.Map.Image.height * this.Map.ImgScale > this.Map.CanvasHeight ? Math.min(Math.max(touch.clientY - this.dragStartY, this.Map.CanvasHeight - (this.Map.Image.height / 2) * this.Map.ImgScale), (this.Map.Image.height / 2) * this.Map.ImgScale) : this.Map.CanvasHeight / 2;
            }
        }
    }
    TouchStart(e) {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            this.initialDistance = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2));
            this.initialScale = this.Map.ImgScale;
        }
        else if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.Map.Canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left - this.Map.ImgX) / this.Map.ImgScale;
            const touchY = (touch.clientY - rect.top - this.Map.ImgY) / this.Map.ImgScale;
            const pointsToMove = [];
            let isHoveringPoint = false;
            this.isDragging = true;
            this.dragStartX = touch.clientX - this.Map.ImgX;
            this.dragStartY = touch.clientY - this.Map.ImgY;
            this.Map.Points.forEach((point) => {
                if (point.PosX == undefined || point.PosY == undefined)
                    return;
                const distance = Math.sqrt((touchX - point.PosX) ** 2 + (touchY - point.PosY) ** 2);
                if ((distance < point.CSize / this.Map.ImgScale && !isHoveringPoint) || point.Dragging) {
                    isHoveringPoint = true;
                    point.Dragging = true;
                    point.Hovered = true;
                    point.Animate();
                    pointsToMove.push(point);
                }
                else if ((distance > point.CSize / this.Map.ImgScale && !point.Dragging) || isHoveringPoint) {
                    point.Dragging = false;
                    point.Hovered = false;
                    point.ReverseAnimate();
                }
            });
            this.Map.Points = this.Map.Points.filter((point) => !pointsToMove.includes(point));
            this.Map.Points.unshift(...pointsToMove);
        }
    }
}


/***/ })

/******/ 	});
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
/* harmony export */   CustomMap: () => (/* binding */ CustomMap)
/* harmony export */ });
/* harmony import */ var _CustomMapHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);

const DefaultFontSize = 32;
const DefaultLineWidth = 3;
class CustomMap {
    Canvas;
    CanvasWidth;
    CanvasHeight;
    ImgX;
    ImgY;
    ImgScale = 1;
    Ctx;
    Image = new Image();
    Points = [];
    NewPoint;
    MouseListeners;
    TouchListener;
    constructor(canvas, imagePath) {
        this.Canvas = canvas;
        this.Ctx = canvas.getContext("2d", { willReadFrequently: true });
        this.Image.src = imagePath;
        this.CanvasWidth = canvas.getBoundingClientRect().width;
        this.CanvasHeight = canvas.getBoundingClientRect().height;
        this.ImgX = this.CanvasWidth / 2;
        this.ImgY = this.CanvasHeight / 2;
        this.MouseListeners = new _CustomMapHandler__WEBPACK_IMPORTED_MODULE_0__.CustomMapMouseHandler(this);
        this.TouchListener = new _CustomMapHandler__WEBPACK_IMPORTED_MODULE_0__.CustomMapTouchHandler(this);
        this.Image.onload = () => {
            const scaleX = canvas.width / this.Image.width;
            const scaleY = canvas.height / this.Image.height;
            this.ImgScale = Math.min(scaleX, scaleY);
            requestAnimationFrame(this.draw);
        };
    }
    resize() {
        if (this.CanvasWidth == 0 || this.CanvasHeight == 0 || this.Canvas.getBoundingClientRect().width == 0 || this.Canvas.getBoundingClientRect().height == 0)
            return;
        requestAnimationFrame(this.draw);
        const canvasContent = this.Ctx.getImageData(0, 0, this.CanvasWidth, this.CanvasHeight);
        this.CanvasWidth = this.Canvas.clientWidth;
        this.Canvas.width = this.CanvasWidth;
        this.CanvasHeight = this.Canvas.clientHeight;
        this.Canvas.height = this.CanvasHeight;
        const scaleX = this.CanvasWidth / this.Image.width;
        const scaleY = this.CanvasHeight / this.Image.height;
        this.ImgScale = Math.min(scaleX, scaleY);
        this.ImgX = this.CanvasWidth / 2;
        this.ImgY = this.CanvasHeight / 2;
        this.Ctx.putImageData(canvasContent, 0, 0);
    }
    draw = () => {
        if (this.CanvasWidth == 0 || this.CanvasHeight == 0 || this.Canvas.getBoundingClientRect().width == 0 || this.Canvas.getBoundingClientRect().height == 0)
            return;
        const scaledFontSize = DefaultFontSize / this.ImgScale;
        const scaledLineWidth = DefaultLineWidth / this.ImgScale;
        this.Ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.Ctx.save();
        this.Ctx.translate(this.ImgX, this.ImgY);
        this.Ctx.scale(this.ImgScale, this.ImgScale);
        this.Ctx.drawImage(this.Image, -this.Image.width / 2, -this.Image.height / 2);
        this.Ctx.lineWidth = scaledLineWidth;
        this.Ctx.font = scaledFontSize + "px Arial";
        for (let i = this.Points.length - 1; i >= 0; i--) {
            const point = this.Points[i];
            this.drawActivityPoints(point, scaledFontSize, scaledLineWidth);
        }
        if (this.NewPoint) {
            this.drawActivityPoints(this.NewPoint, scaledFontSize, scaledLineWidth);
        }
        this.Ctx.restore();
        requestAnimationFrame(this.draw);
    };
    drawActivityPoints(point, scaledFontSize, scaledLineWidth) {
        if (point.PosX == undefined || point.PosY == undefined)
            return;
        const posX = point.PosX;
        const posY = point.PosY;
        const imageScale = this.ImgScale;
        this.Ctx.beginPath();
        this.Ctx.arc(posX, posY, point.CSize / imageScale, 0, 2 * Math.PI);
        this.Ctx.fillStyle = this.rgbToColor(point.RGBAnimation.R, point.RGBAnimation.G, point.RGBAnimation.B);
        this.Ctx.fill();
        this.Ctx.stroke();
        this.Ctx.save();
        this.Ctx.fillStyle = "white";
        this.Ctx.strokeStyle = "black";
        const textWidth = this.Ctx.measureText(point.Label).width / 2;
        this.Ctx.strokeText(point.Label, posX - textWidth, posY - point.CSize / imageScale - scaledFontSize + 10 / imageScale);
        this.Ctx.fillText(point.Label, posX - textWidth, posY - point.CSize / imageScale - scaledFontSize + 10 / imageScale);
        this.Ctx.restore();
    }
    rgbToColor(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

/******/ })()
;