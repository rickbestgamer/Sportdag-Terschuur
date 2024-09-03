export class Option {
	ID: number;
	Option: HTMLOptionElement;

	constructor(id: number, text: string) {
		let option = document.createElement("option");
		this.ID = id;
		this.Option = option;
		option.textContent = text;
	}

	set Text(text: string) {
		this.Option.textContent = text;
	}

	SetSelect = () => {
		this.Option.selected = true;
	};
}

export class SelectWrapper {
	Wrapper: HTMLElement;
	Selects: Select[] = [];
	constructor(wrapper: HTMLElement) {
		this.Wrapper = wrapper;
	}
	AddSelect = (options: SelectOptions): Select => {
		const select = new Select(options);
		this.Selects.push(select);
		return select;
	};
}

interface SelectOptions {
	Null?: boolean;
	Id?: number;
	Update?: (select: Select) => any;
}

export class Select {
	Element = document.createElement("select");
	Options: Option[] = [];
	ItemID: number = 0;
	SelectedOption: string;
	constructor(options: SelectOptions = { Null: true }) {
		if (options.Update) {
			this.Element.addEventListener("change", (e) => {
				const option = this.Element.value;
				const selectOption = this.Element.options[this.Element.selectedIndex];
				this.ItemID = this.Options.find((o) => o.Option == selectOption) ? this.Options.find((o) => o.Option == selectOption)!.ID : 0;
				this.Element.value = this.SelectedOption;
				this.SelectedOption = option;
				options.Update?.(this);
			});
		}
		options.Null = options.Null !== undefined ? options.Null : true;
		if (options.Null) this.CreateOption(0, "");
		if (options.Id) this.ItemID = options.Id;
		this.SelectedOption = this.Element.value;
	}

	CreateOption = (id: number, text: string) => {
		const option = new Option(id, text);
		option.Option.selected = this.ItemID === option.ID;
		this.Options.push(option);
		this.Element.add(option.Option);
	};
}
