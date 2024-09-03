import { Option, BaseSignalRHub, AdminSignalRHub } from "./SignalRHub";
import { StringToElement, TypedEventEmitter } from "../../Functions";
import { ApiResponse, EmitEvents, FormElement, HubEvents, ItemChild, ItemParent, Items, ItemTypes } from "../Types";
import { Member } from "../Items/Member";
import { Trainer } from "../Items/Trainer";
import { Team } from "../Items/Team";

export class BaseHub<T extends Items> {
	protected Hub: AdminSignalRHub<T>;
	Wrapper: HTMLElement;
	Items: T[] = [];
	protected FuncCallBack: TypedEventEmitter<HubEvents>;
	protected NewForm?: HTMLFormElement;
	UpdateItem: (arg: T) => Promise<unknown>;
	DeleteItem: (arg: T) => Promise<unknown>;

	constructor(wrapper: HTMLElement, newForm: HTMLFormElement | undefined, funcCallBack: TypedEventEmitter<HubEvents>, hubName: string, private ItemClass: new (card: HTMLElement, update: (arg: T) => Promise<unknown>, Delete: (arg: T) => Promise<unknown>) => T, updateItem: (arg: T) => Promise<unknown>, deleteItem: (arg: T) => Promise<unknown>) {
		this.Wrapper = wrapper;
		this.FuncCallBack = funcCallBack;
		this.Hub = new AdminSignalRHub(hubName, this.ServerUpdate, this.ServerDelete, this.ServerAdd);
		this.NewForm = newForm;
		this.UpdateItem = updateItem;
		this.DeleteItem = deleteItem;
	}

	protected ExtendServerUpdate?: (item: T, ...args: ItemTypes<T>) => void;
	protected ExtendServerUpdateAfter?: (item: T, id: number | undefined) => void;

	protected ServerUpdate = (...args: ItemTypes<T>) => {
		let item = this.Items.find((i) => i.ID === args[0]);
		if (!item) return;
		this.ExtendServerUpdate?.(item, ...args);
		this.ExtendServerUpdateAfter?.(item, args[4] ? args[4] : (args[3] as number));
		this.emitEvent("update", item);
	};

	protected ServerAdd = (response: ApiResponse) => {
			const element = StringToElement(response.result);
			this.Wrapper.appendChild(element);
			const item = this.NewItem(element);
	};

	AddOption = (parent: ItemParent, item: ItemChild<T>, childID: number, select: HTMLSelectElement, options: Option[]) => {
			let option = item.CreateOption();
			option.Option.selected = item.ID == childID;
			select.appendChild(option.Option);
			options.push(option);
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

	private Creating: boolean = false;

	protected CreateItem = async (createFunc: () => Promise<unknown>): Promise<unknown> => {
		if (this.Creating || !this.NewForm) return;
		const elements = this.NewForm.querySelectorAll("input, button, select") as NodeListOf<FormElement>;
		this.toggleFormElements(elements, false);

		try {
			await createFunc();
		} catch (error) {
			console.error("Error Creating item", error);
		} finally {
			this.toggleFormElements(elements, true);
		}
	};

	private toggleFormElements = (elements: NodeListOf<FormElement>, disabled: boolean) => {
	this.Creating = !disabled;
	this.NewForm!.ariaDisabled = !disabled ? "true" : null;
	elements.forEach((element) => (element.disabled = !disabled));
	};

	protected ExtendAdd?: (item: T) => void;

	NewItem = (card: HTMLElement): T => {
		const item = new this.ItemClass(card, this.UpdateItem, this.DeleteItem);
		this.Items.push(item);
		this.emitEvent("create", item);
		this.ExtendAdd?.(item);
		return item;
	};

	emitEvent = (eventType: EmitEvents, item: T) => {
		const eventMap: Record<EmitEvents, Record<string, keyof HubEvents>> = {
			create: { Team: "teamCreate", Trainer: "trainerCreate", Member: "memberCreate" },
			update: { Team: "teamUpdate", Trainer: "trainerUpdate", Member: "memberUpdate" },
			delete: { Team: "teamDeleted", Trainer: "trainerDeleted", Member: "memberDelete" },
		};
		const itemType = item instanceof Team ? "Team" : item instanceof Trainer ? "Trainer" : item instanceof Member ? "Member" : null;
		if (!itemType) return;
		const event = eventMap[eventType][itemType];
		const payload: any = eventType === "delete" ? { id: item.ID } : { [itemType.toLowerCase()]: item };
		this.FuncCallBack.Emit(event, payload);
	};
}
