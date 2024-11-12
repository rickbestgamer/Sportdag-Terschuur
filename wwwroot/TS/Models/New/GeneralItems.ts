import { Select } from "./Elements/Select/Select";

export class ListWrapper<T extends ListItem = ListItem> {
	Wrapper = document.createElement("div");
	Label = document.createElement("h4");
	Items: Map<number, T> = new Map();

	constructor() {}

	Add = (item: T, id: number, element: HTMLElement) => {
		this.Items.set(id, item);
		this.Wrapper.appendChild(element);
	};

	Update = (id: number, callback: (item: T) => void) => {
		if (this.Items.has(id)) callback(this.Items.get(id)!);
	};

	GetItem = (id: number): T | undefined => {
		return this.Items.get(id);
	};

	Remove = (id: number) => {
		this.Items.delete(id);
	};

	GetAll = () => {
		return Array.from(this.Items.values());
	};

	GetAllIDs = () => {
		return this.Items.keys();
	};
}

export class AdminListWrapper extends ListWrapper<AdminListItem> {
	Select = new Select();

	constructor() {
		super();
		this.Wrapper.append(this.Select.Element);
	}

	set AllowNull(bool: boolean) {
		this.Select.AllowNull = bool;
	}
}

export class ListItem {
	Element = document.createElement("div");
	Label = document.createElement("p");
	private _Text = "";

	constructor(text: string) {
		this.Element.append(this.Label);
		this.Text = text;
	}

	get Text(): string {
		return this._Text;
	}

	set Text(text: string) {
		this._Text = text;
		this.Label.textContent = text;
	}
}

export class AdminListItem extends ListItem {
	Button = document.createElement("button");

	constructor(text: string, deleteFunc: () => void) {
		super(text);
		this.Button.textContent = "X";
		this.Button.onclick = deleteFunc;
		this.Element.append(this.Button);
	}
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

export class ObservableArray<T extends { ID: number }> {
	private items: Map<number, T> = new Map();
	onItemAdded?: (item: T) => void;
	onItemDeleted?: (item: T) => void;

	constructor() {}

	add = (item: T): void => {
		this.items.set(item.ID, item);
		this.onItemAdded?.(item);
	};

	get = (id: number): T | undefined => {
		return this.items.get(id);
	};

	find = (predicate: (value: T, index: number) => unknown) => {
		return Array.from(this.items.values()).find(predicate);
	};

	some = (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) => {
		return Array.from(this.items.values()).some(predicate, thisArg);
	};

	delete = (number: number) => {
		const item = this.get(number);
		if (item) this.onItemDeleted?.(item);
		this.items.delete(number);
	};

	has = (number: number): boolean => {
		return this.items.has(number);
	};

	getAll = (): IterableIterator<T> => {
		return this.items.values();
	};
}
