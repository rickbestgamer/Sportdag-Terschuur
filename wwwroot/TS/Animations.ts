export class CustomAnimation {
	constructor(duration: number) {
		this.Duration = duration;
		this.KeyFrames = [];
		this.EasingFunction = (t) => t;
		this.AnimationProgress = 0;
		this.AnimationFrame = 0;
	}

	Duration: number;
	KeyFrames: InstanceType<typeof CustomAnimation.AnimationKeyframes>[];
	EasingFunction: (t: number) => number;
	AnimationProgress: number;
	AnimationFrame: number;

	static AnimationKeyframes = class AnimationKeyframes {
		KeyTime: number;
		Value: number;

		constructor(keyTime: number, value: number) {
			this.KeyTime = keyTime;
			this.Value = value;
		}
	};

	addKeyFrame(keyTime: number, value: number) {
		this.KeyFrames.push(new CustomAnimation.AnimationKeyframes(keyTime, value));
		this.KeyFrames.sort((a, b) => a.KeyTime - b.KeyTime);
	}

	private animate(drawCallback: (arg0: number) => void, isReversed: boolean) {
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

	startAnimation(drawCallback: (arg0: number) => void) {
		this.animate(drawCallback, false);
	}

	reverseAnimation(drawCallback: (arg0: number) => void) {
		this.animate(drawCallback, true);
	}

	stopAnimation() {
		cancelAnimationFrame(this.AnimationFrame);
	}

	calculateAnimatedValue(progress: number) {
		const keyFrames = this.KeyFrames;
		const keyFrame = keyFrames.find((kf) => kf.KeyTime >= progress);

		if (!keyFrame) {
			return this.KeyFrames[0].Value;
		} else if (keyFrame.KeyTime == progress) {
			return keyFrame.Value;
		} else {
			const prevKeyFrame = keyFrames[keyFrames.indexOf(keyFrame) - 1];
			return prevKeyFrame.Value + (keyFrame.Value - prevKeyFrame.Value) * (progress - prevKeyFrame.KeyTime);
		}
	}

	SetEasingFunction(easingFunction: (t: number) => number): void {
		this.EasingFunction = easingFunction;
	}
}
