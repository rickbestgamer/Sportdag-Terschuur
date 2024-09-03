import { Items, HubEvents, FormElement } from "../../Models/Types";
import { BaseHub } from "./BaseHub";
import { TypedEventEmitter } from "../../Functions";
import { AdminSignalRHub } from "../../Models/Hubs/SignalRHub";

export abstract class AdminBaseHub<T extends Items> extends BaseHub<T> {
	protected NewForm: HTMLFormElement;

	constructor(wrapper: HTMLElement, callBack: TypedEventEmitter<HubEvents>, hubName: string) {
		super(wrapper, callBack, hubName);
	}

	protected createHub(hubName: string): AdminSignalRHub<T> {
		return new AdminSignalRHub<T>(hubName, this.ServerUpdate, this.ServerDelete, this.ServerCreate);
	}

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
}
