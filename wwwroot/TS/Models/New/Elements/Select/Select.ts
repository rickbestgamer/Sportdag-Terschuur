import { Option } from "../../GeneralItems";

export interface SelectOptions {
	ID?: number;
	AllowNull?: boolean;
	Update?: (select: Select) => void;
}

export class Select {
	Element = document.createElement("select");
	private _Options: Option[] = [];
	private _ItemID: number = 0;
	private SelectedOption: string;
	private AllowSelectionChange: boolean = true;
	private _AllowNull: boolean = true;
	Update?: (select: Select) => void;

	constructor(update?: (select: Select) => any) {
		this.Element.addEventListener("change", () => {
			const selectOption = this.Element.options[this.Element.selectedIndex];

			if (this.Update) {
				this.AllowSelectionChange = false;
				const option = this.Element.value;
				this.Element.value = this.SelectedOption;
				this.SelectedOption = option;
			}

			this.ID = this._Options.find((o) => o.Element == selectOption)?.ID ?? 0;
			this.Update?.(this);
		});

		this.AllowNull = this._AllowNull;
		this.Update = update;
		this.SelectedOption = this.Element.value;
	}

	set SelectOptions(options: SelectOptions) {
		if (options.ID) this.ID = options.ID;
		if (options.AllowNull) this.AllowNull = options.AllowNull;
		if (options.Update) this.Update = options.Update;
	}

	get ID(): number {
		return this._ItemID;
	}

	set ID(id: number) {
		const matchingOption = this._Options.find((o) => o.ID === id);

		if (matchingOption && this.AllowSelectionChange) {
			matchingOption.SetSelect();
			this.SelectedOption = matchingOption.Element.value;
		}

		this.AllowSelectionChange = true;
		this._ItemID = id;
	}

	get AllowNull(): boolean {
		return this._AllowNull;
	}

	set AllowNull(bool: boolean) {
		this._AllowNull = bool;
		if (bool) this.CreateOption(0, "");
		else {
			this._Options.find((o) => o.ID == 0)?.Element.remove();
			this._Options = this._Options.filter((o) => o.ID === 0);
		}
	}

	CreateOption = (id: number, text: string) => {
		const option = new Option(id, text);

		this.AddOption(option);
	};

	UpdateOption = (id: number, text: string) => {
		const option = this._Options.find((o) => o.ID == id);
		if (option) option.Text = text;
	};

	DeleteOption = (id: number) => {
		const option = this._Options.find((o) => o.ID === id);
		if (option) {
			this._Options = this._Options.filter((o) => o.ID !== id);
			option.Element.remove();
		}
	};

	AddOption = (option: Option) => {
		option.Element.selected = this.ID === option.ID;

		this.InsertOption(option);
	};

	private InsertOption = (option: Option) => {
		const index = this._Options.findIndex((o) => o.ID > option.ID);

		if (index == -1) {
			this._Options.push(option);
			this.Element.add(option.Element);
		} else {
			this._Options.splice(index, 0, option);
			this.Element.add(option.Element, index);
		}
	};
}
