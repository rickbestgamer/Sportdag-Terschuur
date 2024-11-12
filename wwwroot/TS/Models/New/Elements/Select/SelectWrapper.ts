import { Select } from "./Select";

export class SelectWrapper {
	Element = document.createElement("div");
	Label = document.createElement("h4");
	Select = new Select();

	constructor(text?: string) {
		if (text) this.Label.textContent = text;
		this.Element.append(this.Label, this.Select.Element);
	}

	set text(text: string) {
		this.Label.textContent = text;
	}
}
