import { Select, SelectOptions } from "../Select/Select";
import { InputType } from "./Input";
import { InputLabel, InputLabelOptions } from "./InputLabel";

export class BaseForm {
	Element = document.createElement("div");
	Inputs: Set<HTMLInputElement | HTMLSelectElement> = new Set();
	SubmitButton = document.createElement("button");

	constructor() {
		this.SubmitButton.textContent = "Submit";
		this.SubmitButton.addEventListener("click", this._Submit);
	}

	ServerSubmit?: () => Promise<unknown>;
	IsDuplicate?: () => boolean;
	Reset?: () => void;

	private _Submit = async (e: MouseEvent) => {
		e.preventDefault;

		if (!this.CheckValidity()) return;
		if (this.IsDuplicate && this.IsDuplicate?.()) {
			this.SubmitButton.setCustomValidity("There was a duplicate found with these inputs");
			this.SubmitButton.reportValidity();
			return;
		}
		await this.ServerSubmit?.();
		this.Reset?.()
	};

	CreateInput = <T extends InputType>(input: InputLabel<T>, options: InputLabelOptions<T>): InputLabel<T> => {
		input = new InputLabel(options);
		this.Inputs.add(input.Input.Element);
		return input;
	};

	CreateSelect = (select: Select, options?: SelectOptions) => {
		this.Inputs.add(select.Element);
		if (options) select.SelectOptions = options;
	};

	CheckValidity = () => {
		for (const input of this.Inputs) {
			if (!input.required) continue;
			if (!input.checkValidity()) return input.reportValidity();
		}
		return true;
	};
}
