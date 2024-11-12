import { Option, Select } from "../../GeneralItems";
import { BaseLinkItem } from "./BaseLinkItem";

export class AdminBaseLinkItem extends BaseLinkItem {
	private Options: Set<Option> = new Set();
	private Selects: Set<Select> = new Set();

	constructor(id: number, name: string) {
		super(id, name);
	}

	DeleteOptions = () => {
		for (const option of this.Options) option.Element.remove();
	};

	CreateOption = (): Option => {
		let option = new Option(this.ID, super.Name);

		this.Options.add(option);

		return option;
	};

	CreateSelect = (): Select => {
		let select = new Select();

		select.ID = this.ID;
		select.AddOption(this.CreateOption());
		this.Selects.add(select);

		return select;
	};

	set Name(text: string) {
		super.Name = text;
		for (const option of this.Options) option.Text = text;
	}
}
