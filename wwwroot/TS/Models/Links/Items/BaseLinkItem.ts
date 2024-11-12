
export abstract class BaseLinkItem {
	readonly ID: number;
	private _Name: string;

	constructor(id: number, name: string) {
		this.ID = id;
		this._Name = name;
	}

	get Name(): string {
		return this._Name;
	}

	set Name(text: string) {
		this._Name = text;
	}
}
