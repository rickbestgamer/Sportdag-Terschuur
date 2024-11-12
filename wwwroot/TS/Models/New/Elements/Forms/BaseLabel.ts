export interface BaseLabelOptions {
	ClassName: string;
	Name: string;
}

export class BaseLabel {
	Label = document.createElement("label");
	Element = document.createElement("label");
	private _For = "";

	constructor() {
		this.Element.append(this.Label);
	}

	set Options(options: BaseLabelOptions) {
		this.For = options.ClassName + options.Name;
		this.Label.textContent = options.Name;
	}

	get For(): string {
		return this._For;
	}

	set For(id: string) {
		this._For = id;
		this.Label.htmlFor = id;
		this.Element.htmlFor = id;
	}
}
