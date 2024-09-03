export class BaseItem<T> {
	readonly Card: HTMLElement;
	readonly ID: number;
	private readonly EditButton: HTMLButtonElement;
	private readonly DeleteButton: HTMLButtonElement;
	readonly EditElements: HTMLElement[] = [];
	readonly EditInputs: HTMLInputElement[] = [];
	readonly Update: (arg: T) => Promise<unknown>;
	private readonly Delete: (arg: T) => Promise<unknown>;

	constructor(card: HTMLElement, update: (arg: T) => Promise<unknown>, Delete: (arg: T) => Promise<unknown>) {
		this.Card = card;
		this.ID = parseInt(card.getAttribute("ID")!);
		this.Card.removeAttribute("ID");

		this.EditButton = card.querySelector("button.EditButton")!;
		this.EditButton.addEventListener("click", this.Edit);
		this.DeleteButton = card.querySelector("button.DeleteButton")!;
		this.DeleteButton.addEventListener("click", this.DeleteItem);

		this.Update = update;
		this.Delete = Delete;
	}

	ExtendEdit?: () => void;

	protected Edit = () => {
		this.ExtendEdit?.();
		this.ToggleInputVis();
		this.EditButton.removeEventListener("click", this.Edit);
		this.EditButton.addEventListener("click", this.Confirm);
	};

	ExtendConfirmBefore?: () => boolean;
	ExtendConfirmAfter?: () => void;

	protected Confirm = async () => {
		this.EditButton.removeEventListener("click", this.Confirm);
		if (this.ExtendConfirmBefore?.() && !this.ExtendConfirmBefore?.()) return;
		this.ToggleInput();
		await this.Update(this as unknown as T);
		this.ExtendConfirmAfter?.();
		this.ToggleInputVis();
		this.ToggleInput();
		this.EditButton.addEventListener("click", this.Edit);
	};

	protected DeleteItem = async () => {
		this.Card.style.pointerEvents = "none";
		this.Card.style.opacity = "0.5";
		await this.Delete(this as unknown as T);
	};

	protected ToggleInputVis = () => {
		for (const element of this.EditElements) element.style.display = element.style.display === "none" ? "inline" : "none";
		for (const element of this.EditInputs) element.style.display = element.style.display === "none" ? "inline" : "none";
	};

	protected ToggleInput = () => {
		for (const element of this.EditInputs) element.disabled = !element.disabled;
	};
}
