import { ObservableArray } from "../GeneralItems";
import { Items, ServerItem } from "../Types";

export abstract class BaseHub<T extends Items> {
	Wrapper: HTMLElement;
	Items = new ObservableArray<T>();

	constructor(wrapper: HTMLElement) {
		this.Wrapper = wrapper;
		this.Items.onItemAdded = (item: T) => {
			wrapper.appendChild(item.Card.Element);
		};
		this.Items.onItemDeleted = (item: T) => {
			item.Remove()
		}
	}

	// protected ServerCreate = (response: ApiResponse): T => {
	// 	const element = StringToElement(response.result);

	// 	this.Wrapper.appendChild(element);

	// 	return this.CreateItem(element);
	// };

	// protected abstract ExtendServerUpdate?: (item: T, ...args: ServerUpdate<T>) => void;

	// protected ServerUpdate = (args: ServerUpdateBase<T>) => {
	// 	let item = this.Items.find((i) => i.ID === args.ID);
	// 	if (!item) {
	// 		console.warn(`Item with ID ${args.ID} not found for update.`);
	// 		return;
	// 	}
	// 	this.ExtendServerUpdate?.(item, ...(rest as ServerUpdate<T>));
	// };

	// protected abstract ExtendServerDelete?: (item: T) => void;

	// protected ServerDelete = (id: number) => {
	// 	const item = this.Items.find((i) => i.ID === id);
	// 	if (!item) {
	// 		console.warn(`Item with ID ${id} not found for deletion.`);
	// 		return;
	// 	}
	// 	item.Card.remove();
	// 	this.Items = this.Items.filter((i) => i !== item);
	// 	this.ExtendServerDelete?.(item);
	// };

	protected abstract ConstructItem: (card: ServerItem<T>) => T;
	protected ExtendCreate?: (item: T) => void;

	CreateItem = (serverItem: ServerItem<T>): T => {
		const item = this.ConstructItem(serverItem);
		this.Items.add(item);
		this.ExtendCreate?.(item);
		return item;
	};
}
