import { CustomAnimation } from "./Animations";
import { RGBAnimation } from "./RGBAnimation";

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
export class Point {
	PosX?: number;
	PosY?: number;
	ID?: number;
	Label: string;
	Type: number;
	Hovered: boolean;
	Dragging: boolean;
	CColor: string;
	CSize: number;
	RGBAnimation: RGBAnimation;
	SizeAnimation: CustomAnimation;

	constructor(label: string, type: number, easingFunction?: (t: number) => number, x?: number, y?: number, id?: number, dragging?: boolean) {
		const duration: number = 300;
		const InitialSize: number = 12;
		this.PosX = x;
		this.PosY = y;
		this.ID = id;
		this.Label = label;
		this.Type = type;
		this.Hovered = false;

		if (dragging) {
			this.Dragging = dragging;
		} else {
			this.Dragging = false;
		}

		this.CColor = "red";
		this.CSize = InitialSize;
		this.RGBAnimation = new RGBAnimation(duration, "red", "blue");
		this.SizeAnimation = new CustomAnimation(duration);
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

	SetEasingFunction(easingFunction: (t: number) => number): void {
		this.SizeAnimation.SetEasingFunction(easingFunction);
	}
}
