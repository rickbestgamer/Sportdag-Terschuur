import { BaseElement } from "./BaseElement";

export class AdminBaseElement {
	EditButton = document.createElement("button");
	DeleteButton = document.createElement("button");
	private Card: BaseElement;
	protected _Update: () => Promise<unknown>;
	protected _Delete: () => Promise<unknown>;

	constructor(card: BaseElement, update: () => Promise<unknown>, Delete: () => Promise<unknown>) {
		this.Card = card;
		this.EditButton.textContent = "Edit";
		this.EditButton.onclick = this._Edit;
		this.DeleteButton.textContent = "Delete";
		this.DeleteButton.onclick = this.DeleteItem;
		this._Update = update;
		this._Delete = Delete;
	}

	ExtendEdit?: () => void;
	ExtendConfirmBefore?: () => boolean;
	ExtendConfirmAfter?: () => void;
	ToggleInputVis?: () => void;
	ToggleInput?: () => void;

	ToggleAppend = (element: HTMLElement, wrapper: HTMLElement) => {
		if (element.parentElement) {
			element.remove();
		} else {
			wrapper.append(element);
		}
	};

	ToggleDisabled = (element: HTMLInputElement) => {
		element.disabled = !element.disabled;
	};

	protected _Edit = () => {
		this.ExtendEdit?.();
		this.ToggleInputVis?.();
		this.EditButton.textContent = "Confirm";
		this.EditButton.onclick = this._Confirm;
	};

	protected _Confirm = async () => {
		if (!this.ExtendConfirmBefore?.()) return;

		this.ToggleInput?.();

		await this._Update();

		this.ToggleInput?.();
		this.ToggleInputVis?.();
		this.ExtendConfirmAfter?.();
		this.EditButton.textContent = "Edit";
		this.EditButton.onclick = this._Confirm;
	};

	protected DeleteItem = async () => {
		if (!this._Delete) return console.log("No delete function defined on this item");
		this.Card.Element.style.pointerEvents = "none";
		this.Card.Element.style.opacity = "0.5";

		await this._Delete();
	};
}
