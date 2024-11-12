/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3:
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


/***/ }),

/***/ 72:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

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


/***/ }),

/***/ 70:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ 4:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ 2:
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
/* harmony import */ var _CustomMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _Functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(70);
/* harmony import */ var _Points__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);



class Activity {
    Select;
    Point;
    constructor(element, point) {
        this.Select = element;
        this.Point = point;
        this.Select.addEventListener("change", this.UpdateType);
    }
    UpdateType = () => {
        this.Point.Type = parseInt(this.Select.value);
        UpdatePoint(this.Point);
    };
}
const canvas = document.getElementById("FieldCanvas");
const map = new _CustomMap__WEBPACK_IMPORTED_MODULE_0__.CustomMap(canvas, imagePath);
const observer = new ResizeObserver(() => {
    map.resize();
});
observer.observe(canvas);
const addButtonWrapper = document.getElementById("FieldWrapper").querySelector("#MapAddWrapper");
const addButton = addButtonWrapper.querySelector("#MapAddButton");
const addFieldWrapper = document.getElementById("AddActivityWrapper");
const addFieldForm = addFieldWrapper.querySelector("#AddActivityForm");
const addField = addFieldForm.querySelector("#AddActivityField");
let activities = document.getElementsByClassName("ActivityWrapper");
const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
addButtonWrapper?.addEventListener("click", () => {
    addFieldWrapper.style.scale = addFieldWrapper.style.scale == "1" ? "0" : "1";
    addButton.classList.toggle("Open");
});
addFieldWrapper?.querySelector("button")?.addEventListener("click", NewActivity);
addFieldForm.addEventListener("submit", (e) => {
    e.preventDefault();
    NewActivity();
});
for (let activityWrapper of activities) {
    const activity = activityWrapper.querySelector(".Activity");
    let xStr = activity.getAttribute("PosX");
    let yStr = activity.getAttribute("PosY");
    let idStr = activity.getAttribute("ID");
    let lStr = activity.getAttribute("Name");
    let tStr = activity.getAttribute("Type");
    activity.removeAttribute("PosX");
    activity.removeAttribute("PosY");
    activity.removeAttribute("ID");
    activity.removeAttribute("Name");
    activity.removeAttribute("Type");
    if (xStr !== null && yStr !== null && idStr !== null && lStr !== null && tStr !== null) {
        let x = parseInt(xStr);
        let y = parseInt(yStr);
        let id = parseInt(idStr);
        let type = parseInt(tStr);
        let point = new _Points__WEBPACK_IMPORTED_MODULE_2__.Point(lStr, type, ease, x, y, id);
        let select = activityWrapper.querySelector("select");
        new Activity(select, point);
        map.Points.push(point);
        activityWrapper.querySelector("button").addEventListener("click", async () => {
            RemoveActivity(point, activityWrapper);
        });
    }
}
canvas.addEventListener("mousedown", (e) => {
    if (map.NewPoint) {
        CreatePoint(map.NewPoint);
    }
    map.MouseListeners.MouseDown(e);
});
canvas.addEventListener("mouseup", () => {
    map.Points.forEach((point) => {
        if (point.Dragging) {
            UpdatePoint(point);
        }
    });
    map.MouseListeners.MouseUp();
});
canvas.addEventListener("mousemove", (e) => {
    map.MouseListeners.MouseMove(e);
});
canvas.addEventListener("mouseleave", (e) => {
    map.MouseListeners.MouseLeave(e);
});
canvas.addEventListener("wheel", (e) => {
    map.MouseListeners.Wheel(e);
}, { passive: false });
canvas.addEventListener("touchstart", (e) => {
    if (map.NewPoint) {
        CreatePoint(map.NewPoint);
    }
    map.TouchListener.TouchStart(e);
}, { passive: false });
canvas.addEventListener("touchmove", (e) => {
    map.TouchListener.TouchMove(e);
}, { passive: false });
canvas.addEventListener("touchend", (e) => {
    map.Points.forEach((point) => {
        if (point.Dragging) {
            UpdatePoint(point);
        }
    });
    map.TouchListener.TouchEnd(e);
});
canvas.addEventListener("touchcancel", (e) => {
    map.TouchListener.TouchCancel(e);
});
function NewActivity() {
    const inputValue = addField.value;
    const selectValue = addFieldWrapper.querySelector("select").value;
    let type = parseInt(selectValue);
    let Exist = false;
    map.Points.forEach((point) => {
        if (point.Label == inputValue)
            Exist = true;
    });
    if (inputValue == "" || Exist)
        return;
    map.NewPoint = new _Points__WEBPACK_IMPORTED_MODULE_2__.Point(inputValue, type, ease, undefined, undefined, undefined, true);
    addFieldWrapper.style.scale = "0";
    addButton.classList.toggle("Open", false);
    addField.value = "";
}
async function RemoveActivity(point, activityWrapper) {
    let completed = await PointFetch(point, "delete");
    if (!completed)
        return;
    delete map.Points[map.Points.indexOf(point)];
    RemoveAnimation(activityWrapper);
}
async function RemoveAnimation(activityWrapper) {
    const time = 0.8;
    activityWrapper.style.height = activityWrapper.clientHeight + "px";
    activityWrapper.getBoundingClientRect();
    activityWrapper.style.transition = time + "s";
    activityWrapper.style.opacity = "0";
    activityWrapper.style.scale = "1 0";
    activityWrapper.style.height = "0px";
    activityWrapper.style.paddingBlock = "0";
    activityWrapper.style.marginBottom = "0";
    activityWrapper.style.pointerEvents = "none";
    await new Promise((resolve) => setTimeout(resolve, time * 1000));
    activityWrapper.remove();
}
async function EnterAnimation(activityWrapper) {
    const time = 0.8;
    activityWrapper.style.transition = time + "s";
    activityWrapper.style.opacity = "0";
    activityWrapper.style.scale = "1 0";
    activityWrapper.style.paddingBlock = "0";
    activityWrapper.style.marginBottom = "0";
    activityWrapper.style.pointerEvents = "none";
    activityWrapper.getBoundingClientRect();
    activityWrapper.style.opacity = "1";
    activityWrapper.style.scale = "1 1";
    activityWrapper.style.paddingBlock = "2rem";
    activityWrapper.style.marginBottom = "2rem";
    activityWrapper.style.pointerEvents = "all";
    await new Promise((resolve) => setTimeout(resolve, time * 1000));
    activityWrapper.style.transition = "";
}
function CreatePoint(point) {
    PointFetch(point, "create");
}
function UpdatePoint(point) {
    PointFetch(point, "update");
}
async function PointFetch(point, fetchType) {
    if (!point.PosX || !point.PosY)
        return false;
    const x = point.PosX, y = point.PosY, label = point.Label, type = point.Type;
    let id = undefined;
    let result = false;
    if (point.ID) {
        id = point.ID;
    }
    if (UpdateFetchPath !== undefined) {
        const path = `${UpdateFetchPath}&Statement=${fetchType}&X=${x}&Y=${y}&Label=${label}&Type=${type}${id ? `&ID=${id}` : ``}`;
        await fetch(path)
            .then((response) => response.json())
            .then((data) => {
            result = data["status"];
            if (data["id"]) {
                const firstChild = (0,_Functions__WEBPACK_IMPORTED_MODULE_1__.StringToElement)(data["string"]);
                const button = firstChild.querySelector("button");
                button.addEventListener("click", async () => {
                    RemoveActivity(point, firstChild);
                });
                point.ID = parseInt(data["id"]);
                document.getElementById("ActivityList")?.appendChild(firstChild);
                EnterAnimation(firstChild);
            }
        });
    }
    return result;
}

/******/ })()
;