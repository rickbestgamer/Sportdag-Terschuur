import { FormElement } from "../Types";
import { AdminItems } from "../Types";
import { BaseHub } from "../Hubs/BaseHub";
import { AdminSignalRHub } from "../Hubs/SignalRHub";

export abstract class AdminBaseHub<T extends AdminItems> extends BaseHub<T, AdminSignalRHub<T>> {
	protected NewForm?: HTMLFormElement;
	protected FormElement?: NodeListOf<FormElement>;

	constructor(wrapper: HTMLElement, hubName: string, newForm?: HTMLFormElement) {
		super(wrapper, hubName);
		this.NewForm = newForm;
		this.FormElement = newForm?.querySelectorAll("input, button, select");
	}

	protected createHub(hubName: string): AdminSignalRHub<T> {
		return new AdminSignalRHub<T>(hubName, this.ServerUpdate, this.ServerDelete, this.ServerCreate);
	}

	private Creating: boolean = false;

	protected ExecuteCreate = async (createFunc: () => Promise<unknown>, errorCallback?: (error: unknown) => void): Promise<unknown> => {
		if (this.Creating || !this.NewForm || !this.FormElement) return;

		this.toggleFormElements(this.FormElement, false);

		try {
			await createFunc();
		} catch (error) {
			console.error("Error Creating item", error);
			if (errorCallback) errorCallback(error);
		} finally {
			this.toggleFormElements(this.FormElement, true);
		}
	};

	private toggleFormElements = (elements: NodeListOf<FormElement>, disabled: boolean) => {
		this.Creating = !disabled;
		this.NewForm!.ariaDisabled = !disabled ? "true" : null;

		for (const element of elements) element.disabled = !disabled;
	};
}
