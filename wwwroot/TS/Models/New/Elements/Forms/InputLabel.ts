import { BaseLabel, BaseLabelOptions } from "./BaseLabel";
import { Input, InputOptions, InputType } from "./Input";

export interface InputLabelOptions<T extends InputType> extends BaseLabelOptions, InputOptions<T> {}

export class InputLabel<T extends InputType> extends BaseLabel {
	Input = new Input<T>();

	constructor(options?: InputLabelOptions<T>) {
		super();
		this.Element.append(this.Input.Element);
		if (options) {
			this.Input.Options = options;
			this.Options = options;
		}
	}

	set Options(v: InputLabelOptions<T>) {
		super.Options = v;

		this.Input.Options = v;
	}

	get value(): string {
		return this.Input.Element.value;
	}

	set value(v: string) {
		this.Input.Element.value = v;
	}
}
