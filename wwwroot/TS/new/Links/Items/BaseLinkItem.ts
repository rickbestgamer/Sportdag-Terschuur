import { Option } from "../../GeneralItems";

export abstract class BaseLinkItem {
	readonly ID: number;
	_Name: string;
	Options: Option[] = [];

	constructor(id: number, name: string) {
		this.ID = id;
		this._Name = name;
	}

	CreateOption = (): Option => {
		let option = new Option(this.ID, this.Name);
		this.Options.push(option);
		return option;
	};

	set Name(text: string) {
		this._Name = text;
		for (const option of this.Options) option.Text = text;
	}
}
