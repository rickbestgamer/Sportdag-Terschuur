import { CallbackRegistry } from "./CallBackRegistry";
import { HubFactory } from "./HubFactory";
import { ItemCollection } from "./ItemCollection";

export abstract class BaseLinkHub<T> extends HubFactory {
	private IC: ItemCollection<T>;
	private CBR: CallbackRegistry<T>;

	constructor() {
		super();
		this.IC = new ItemCollection<T>();
		this.CBR = new CallbackRegistry<T>();
	}

	protected AddItem = (linkItem: T) => {
		this.IC.Add(linkItem);
		this.CBR.Add(linkItem);
	};

	protected UpdateItem = (linkItem: T) => {
		this.CBR.Update(linkItem);
	};

	protected DeleteItem = (linkItem: T) => {
		this.IC.Delete(linkItem);
		this.CBR.Delete(linkItem);
	};

	GetItems = (): Set<T> => {
		return this.IC.GetItems();
	};

	RegAdd = (CB: (linkItem: T) => void) => {
		this.CBR.RegAdd(CB);
		this.IC.All(CB);
	};

	RegUpdate = (CB: (linkItem: T) => void) => {
		this.CBR.RegUpdate(CB);
	};

	RegDelete = (CB: (linkItem: T) => void) => {
		this.CBR.RegDelete(CB);
	};
}
