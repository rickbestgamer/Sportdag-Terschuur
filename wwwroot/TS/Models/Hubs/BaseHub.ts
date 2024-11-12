import { StringToElement } from "../../Functions";
import { AdminItems, ApiResponse, Items, ServerUpdate, ServerUpdateBase } from "../../Models/Types";
import { BaseSignalRHub } from "./SignalRHub";

export abstract class BaseHub<T extends Items | AdminItems, H extends BaseSignalRHub<T> = BaseSignalRHub<T>> {
	protected Hub: H;
	Wrapper: HTMLElement;
	Items: T[] = [];

	constructor(wrapper: HTMLElement, hubName: string) {
		this.Wrapper = wrapper;
		this.Hub = this.createHub(hubName);
	}

	protected createHub(hubName: string): H {
		return new BaseSignalRHub<T>(hubName, this.ServerUpdate, this.ServerDelete, this.ServerCreate) as H;
	}

	protected ServerCreate = (response: ApiResponse): T => {
		const element = StringToElement(response.result);

		this.Wrapper.appendChild(element);

		return this.CreateItem(element);
	};

	protected abstract ExtendServerUpdate?: (item: T, ...args: ServerUpdate<T>) => void;

	protected ServerUpdate = (...args: ServerUpdateBase<T>) => {
		const [id, ...rest] = args;
		let item = this.Items.find((i) => i.ID === args[0]);
		if (!item) {
			console.warn(`Item with ID ${id} not found for update.`);
			return;
		}
		this.ExtendServerUpdate?.(item, ...(rest as ServerUpdate<T>));
	};

	protected abstract ExtendServerDelete?: (item: T) => void;

	protected ServerDelete = (id: number) => {
		const item = this.Items.find((i) => i.ID === id);
		if (!item) {
			console.warn(`Item with ID ${id} not found for deletion.`);
			return;
		}
		item.Card.remove();
		this.Items = this.Items.filter((i) => i !== item);
		this.ExtendServerDelete?.(item);
	};

	protected abstract ConstructItem: (card: HTMLElement) => T;
	protected ExtendCreate?: (item: T) => void;

	CreateItem = (card: HTMLElement): T => {
		const item = this.ConstructItem(card);
		this.Items.push(item);
		this.ExtendCreate?.(item);
		return item;
	};
}
