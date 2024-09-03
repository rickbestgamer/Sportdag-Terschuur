import { Option } from "../Hubs/SignalRHub";

export class BaseItemChild {
	readonly ID: number;
	Name: string;
	Options: HTMLOptionElement[] = [];

	constructor(id: number, name: string) {
		this.ID = id;
		this.Name = name;
	}

	CreateOption = (): Option => {
		let option = new Option(this.ID, this.Name);
		this.Options.push(option.Option);
		return option;
	};
}
