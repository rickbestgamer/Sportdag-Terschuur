export type InputOptions<T extends InputType> = {
	Placeholder: string;
	ClassName: string;
	Name: string;
	Type: T;
	Required?: boolean;
};

export type InputType = "text" | "checkbox" | "email";

export class Input<T extends InputType> {
	Element = document.createElement("input");
	private _Required = false;
	private _Placeholder = "";
	private _ClassName = "";
	private _Name = "";

	constructor(options?: InputOptions<T>) {
		if (options) this.Options = options;
	}

	set Options(options: InputOptions<T>) {
		this.ClassName = options.ClassName;
		this.Name = options.Name;
		this.Placeholder = options.Placeholder;
		this.Type = options.Type;
		if (options.Required !== undefined) this.Required = options.Required;
	}

	get ClassName(): string {
		return this._ClassName;
	}

	set ClassName(v: string) {
		this._ClassName = v;
		this.Element.id = v + this._Name;
	}

	get Name(): string {
		return this._Name;
	}

	set Name(v: string) {
		this._Name = v;
		this.Element.id = this._ClassName + v;
	}

	get Required(): boolean {
		return this._Required;
	}

	set Required(v: boolean) {
		this._Required = v;
		this.Element.required = v;
	}

	get Placeholder(): string {
		return this._Placeholder;
	}

	set Placeholder(v: string) {
		this._Placeholder = v;
		this.Element.placeholder = v;
	}

	set Type(type: T) {
		this.Element.type = type;
	}
}
