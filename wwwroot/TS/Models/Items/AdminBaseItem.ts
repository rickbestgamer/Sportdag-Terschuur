import { BaseItem } from "./BaseItem";

export abstract class AdminBaseItem<T extends AdminBaseItem<T>> extends BaseItem {
	private readonly EditButton: HTMLButtonElement;
	private readonly DeleteButton: HTMLButtonElement;
	readonly EditElements: Set<HTMLElement> = new Set();
	readonly EditInputs: Set<HTMLInputElement> = new Set();

	constructor(card: HTMLElement) {
		super(card);

		this.EditButton = card.querySelector("button.EditButton")!;
		this.EditButton.addEventListener("click", this.Edit);
		this.DeleteButton = card.querySelector("button.DeleteButton")!;
		this.DeleteButton.addEventListener("click", this.DeleteItem);
	}

	protected ExtendEdit?: () => void;

	protected Edit = () => {
		this.ExtendEdit?.();
		this.ToggleInputVis();
		this.EditButton.removeEventListener("click", this.Edit);
		this.EditButton.addEventListener("click", this.Confirm);
	};

	protected abstract ItemInstance: () => T;

	protected ExtendConfirmBefore?: () => boolean;
	protected ExtendConfirmAfter?: () => void;

	protected abstract Update: (arg: T) => Promise<unknown>;

	protected Confirm = async () => {
		if (!this.ExtendConfirmBefore?.()) return;
		this.EditButton.removeEventListener("click", this.Confirm);

		this.ToggleInput();

		await this.Update(this.ItemInstance());

		this.ToggleInput();
		this.ToggleInputVis();
		this.ExtendConfirmAfter?.();
		this.EditButton.addEventListener("click", this.Edit);
	};

	protected abstract Delete: (arg: T) => Promise<unknown>;

	protected DeleteItem = async () => {
		this.Card.style.pointerEvents = "none";
		this.Card.style.opacity = "0.5";

		await this.Delete(this.ItemInstance());
	};

	protected ToggleInputVis = () => {
		for (const element of this.EditElements) element.style.display = element.style.display === "none" ? "inline" : "none";
		for (const element of this.EditInputs) element.style.display = element.style.display === "none" ? "inline" : "none";
	};

	protected ToggleInput = () => {
		for (const element of this.EditInputs) element.disabled = !element.disabled;
	};
}
