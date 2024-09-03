import { CustomMapMouseHandler, CustomMapTouchHandler } from "./CustomMapHandler";
import { delay } from "./Functions";
import { Point } from "./Points";

const DefaultFontSize = 32;
const DefaultLineWidth = 3;

export class CustomMap {
	Canvas: HTMLCanvasElement;
	CanvasWidth: number;
	CanvasHeight: number;
	ImgX: number;
	ImgY: number;
	ImgScale: number = 1;
	Ctx: CanvasRenderingContext2D;
	Image: HTMLImageElement = new Image();
	Points: Point[] = [];
	NewPoint?: Point;
	MouseListeners: CustomMapMouseHandler;
	TouchListener: CustomMapTouchHandler;

	constructor(canvas: HTMLCanvasElement, imagePath: string) {
		this.Canvas = canvas;
		this.Ctx = canvas.getContext("2d", { willReadFrequently: true })!;
		this.Image.src = imagePath;
		this.CanvasWidth = canvas.getBoundingClientRect().width;
		this.CanvasHeight = canvas.getBoundingClientRect().height;
		this.ImgX = this.CanvasWidth / 2;
		this.ImgY = this.CanvasHeight / 2;
		this.MouseListeners = new CustomMapMouseHandler(this);
		this.TouchListener = new CustomMapTouchHandler(this);

		this.Image.onload = () => {
			const scaleX = canvas.width / this.Image.width;
			const scaleY = canvas.height / this.Image.height;
			this.ImgScale = Math.min(scaleX, scaleY);
			requestAnimationFrame(this.draw);
		};
	}

	resize() {
		if (this.CanvasWidth == 0 || this.CanvasHeight == 0 || this.Canvas.getBoundingClientRect().width == 0 || this.Canvas.getBoundingClientRect().height == 0) return;
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
		if (this.CanvasWidth == 0 || this.CanvasHeight == 0 || this.Canvas.getBoundingClientRect().width == 0 || this.Canvas.getBoundingClientRect().height == 0) return;

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

	drawActivityPoints(point: Point, scaledFontSize: number, scaledLineWidth: number) {
		if (point.PosX == undefined || point.PosY == undefined) return;

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

	rgbToColor(r: number, g: number, b: number) {
		return `rgb(${r}, ${g}, ${b})`;
	}
}
