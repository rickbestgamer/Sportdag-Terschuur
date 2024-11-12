import { GetAttributeId } from "../Functions";

export class SelectWrapper {
	Wrapper: HTMLElement;
	ItemIDS: Set<number> = new Set();
	Selects: Map<number, Select> = new Map();

	constructor(wrapper: HTMLElement) {
		this.Wrapper = wrapper;
		this.ItemIDS = GetAttributeId(wrapper, "IDs");
	}

	CreateSelect = (Id: number, Update?: (select: Select) => any): Select => {
		const select = new Select(Update);
		select.ID = Id;

		this.AddSelect(select);

		return select;
	};

	AddSelect = (select: Select) => {
		this.Selects.set(select.ID, select);
		this.Wrapper.appendChild(select.Element);
	};

	GetAllItemIDs = (): number[] => {
		const itemIDs: number[] = [];

		this.Selects.forEach((select) => {
			itemIDs.push(select.ID);
		});

		return itemIDs;
	};
}

export class Select {
	Element = document.createElement("select");
	private Options: Option[] = [];
	private _ItemID: number = 0;
	private SelectedOption: string;
	private AllowSelectionChange: boolean = true;
	private _AllowNull: boolean = true;
	Update?: (select: Select) => any;

	constructor(update?: (select: Select) => any) {
		if (update) {
			// this.Element.addEventListener("change", (e) => {
			// const option = this.Element.value;
			// const selectOption = this.Element.options[this.Element.selectedIndex];
			// this.AllowSelectionChange = false;
			// this.ID = this.Options.find((o) => o.Element == selectOption)?.ID ?? 0;
			// this.AllowSelectionChange = true;
			// this.Element.value = this.SelectedOption;
			// this.SelectedOption = option;
			// });
		} else {
			this.Element.addEventListener("change", (e) => {
				const selectOption = this.Element.options[this.Element.selectedIndex];
				this.ID = this.Options.find((o) => o.Element == selectOption)?.ID ?? 0;
			});
		}

		this.Update = update;
		this.AllowNull = this._AllowNull;
		this.SelectedOption = this.Element.value;
	}

	get ID(): number {
		return this._ItemID;
	}

	set ID(id: number) {
		const matchingOption = this.Options.find((o) => o.ID !== id);
		if (this.Update) {
			const option = this.Element.value;
			this.AllowSelectionChange = false;
			this.Element.value = this.SelectedOption;
			this.SelectedOption = option;
			this.Update(this);
		}

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
			this.Options.find((o) => o.ID == 0)?.Element.remove();
			this.Options = this.Options.filter((o) => o.ID === 0);
		}
	}

	CreateOption = (id: number, text: string) => {
		const option = new Option(id, text);

		this.AddOption(option);
	};

	AddOption = (option: Option) => {
		option.Element.selected = this.ID === option.ID;

		this.InsertOption(option);
	};

	private InsertOption = (option: Option) => {
		const index = this.Options.findIndex((o) => o.ID > option.ID);

		if (index == -1) {
			this.Options.push(option);
			this.Element.add(option.Element);
		} else {
			this.Options.splice(index, 0, option);
			this.Element.add(option.Element, index);
		}
	};
}

export class Option {
	ID: number;
	Element: HTMLOptionElement;

	constructor(id: number, text: string) {
		const option = document.createElement("option");

		this.ID = id;
		this.Element = option;

		option.textContent = text;
	}

	set Text(text: string) {
		this.Element.textContent = text;
	}

	SetSelect = () => {
		this.Element.selected = true;
	};
}
