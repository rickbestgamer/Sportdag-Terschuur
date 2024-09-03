import { StringToElement, TypedEventEmitter } from "../../Functions";
import { BaseSignalRHub } from "../../Models/Hubs/SignalRHub";
import { Member } from "../../Models/Items/Member";
import { Team } from "../../Models/Items/Team";
import { Trainer } from "../../Models/Items/Trainer";
import { ApiResponse, EmitEvents, HubEvents, Items, ItemTypes } from "../../Models/Types";

export abstract class BaseHub<T extends Items> {
	protected Hub: BaseSignalRHub<T>;
	Wrapper: HTMLElement;
	Items: T[] = [];
	private CallBack: TypedEventEmitter<HubEvents>;

	constructor($Wrapper: HTMLElement, $CallBack: TypedEventEmitter<HubEvents>, hubName: string) {
		this.Wrapper = $Wrapper;
		this.Hub = this.createHub(hubName);
		this.CallBack = $CallBack;
	}

	protected createHub(hubName: string): BaseSignalRHub<T> {
		return new BaseSignalRHub<T>(hubName, this.ServerUpdate, this.ServerDelete, this.ServerCreate);
	}

	protected ServerCreate = (response: ApiResponse) => {
		const element = StringToElement(response.result);
		this.Wrapper.appendChild(element);
		const item = this.NewItem(element);
	};

	protected ExtendServerUpdate?: (item: T, ...args: ItemTypes<T>) => void;
	protected ExtendServerUpdateAfter?: (item: T, id: number | undefined) => void;

	protected ServerUpdate = (...args: ItemTypes<T>) => {
		let item = this.Items.find((i) => i.ID === args[0]);
		if (!item) return;
		this.ExtendServerUpdate?.(item, ...args);
		this.ExtendServerUpdateAfter?.(item, args[4] ? args[4] : (args[3] as number));
		this.emitEvent("update", item);
	};

	protected ExtendServerDelete?: (item: T) => void;

	protected ServerDelete = (id: number) => {
		const item = this.Items.find((i) => i.ID === id);
		if (!item) return;
		item.Card.remove();
		this.Items = this.Items.filter((i) => i !== item);
		this.emitEvent("delete", item);
		this.ExtendServerDelete?.(item);
	};

	protected abstract CreateNewItem: (card: HTMLElement) => T;
	protected ExtendNew?: (item: T) => void;

	NewItem = (card: HTMLElement): T | undefined => {
		const item = this.CreateNewItem(card);
		this.Items.push(item);
		this.emitEvent("create", item);
		this.ExtendNew?.(item);
		return item;
	};

	emitEvent = (eventType: EmitEvents, item: T) => {
		const eventMap: Record<EmitEvents, Record<string, keyof HubEvents>> = {
			create: { team: "teamCreate", trainer: "trainerCreate", member: "memberCreate" },
			update: { team: "teamUpdate", trainer: "trainerUpdate", member: "memberUpdate" },
			delete: { team: "teamDeleted", trainer: "trainerDeleted", member: "memberDelete" },
		};
		const itemType = item instanceof Team ? "team" : item instanceof Trainer ? "trainer" : item instanceof Member ? "member" : null;
		if (!itemType) return;
		const event = eventMap[eventType][itemType];
		const payload: any = eventType === "delete" ? { id: item.ID } : { itemType: item };
		this.CallBack.Emit(event, payload);
	};
}
