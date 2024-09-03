import { CustomAnimation } from "./Animations";

export class RGBAnimation {
	RAnimation: CustomAnimation;
	GAnimation: CustomAnimation;
	BAnimation: CustomAnimation;
	R: number;
	G: number;
	B: number;

	constructor(duration: number, sColor: string, eColor: string) {
		this.RAnimation = new CustomAnimation(duration);
		this.GAnimation = new CustomAnimation(duration);
		this.BAnimation = new CustomAnimation(duration);
		const oColor: number[] = this.parseColor(sColor);
		const fColor: number[] = this.parseColor(eColor);
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

	parseColor(color: string): number[] {
		const ctxC = document.createElement("canvas").getContext("2d")!;
		ctxC.fillStyle = color;
		const computedColor = ctxC.fillStyle;
		let rgb: number[];

		if (computedColor.startsWith("#")) {
			let hex = computedColor.slice(1);
			if (hex.length === 3) {
				hex = hex
					.split("")
					.map((h) => h + h)
					.join("");
			}
			rgb = [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
		} else {
			rgb = computedColor.match(/\d+/g)!.map(Number);
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

	SetEasingFunction(easingFunction: (t: number) => number): void {
		this.RAnimation.SetEasingFunction(easingFunction);
		this.GAnimation.SetEasingFunction(easingFunction);
		this.BAnimation.SetEasingFunction(easingFunction);
	}
}
