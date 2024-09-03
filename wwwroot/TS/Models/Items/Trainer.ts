import { BaseItem } from "./BaseItem";
import { BaseItemTeam } from "./BaseItemTeam";

export class Trainer extends BaseItem<Trainer> {
	ItemTeams: BaseItemTeam<Trainer>;
	_Name: string = "";
	NameSpan: HTMLSpanElement;
	NameInput: HTMLInputElement;
	Role: HTMLInputElement;

	constructor(card: HTMLElement, update: (arg: Trainer) => Promise<unknown>, Delete: (arg: Trainer) => Promise<unknown>) {
		super(card, update, Delete);
		this.ItemTeams = new BaseItemTeam<Trainer>(this, update);
		this.NameSpan = card.querySelector("span.UserName")!;
		this.NameInput = card.querySelector("input.UserName")!;
		this.Name = card.getAttribute("Name")!;
		card.removeAttribute("Name")!;

		this.EditElements.push(this.NameSpan);
		this.EditInputs.push(this.NameInput);

		this.Role = card.querySelector("input.TrainerRole")!;
		this.Role.addEventListener("change", async () => {
			this.Role.disabled = true;
			this.Update(this);
			this.Role.disabled = false;
		});
	}

	ExtendConfirmBefore = (): boolean => {
		if (this.NameInput.value == "") return false;
		this.Name = this.NameInput.value;
		return true;
	};

	get Name(): string {
		return this._Name;
	}

	set Name(name: string) {
		this._Name = name;
		this.NameInput.value = name;
		this.NameSpan.textContent = name;
	}
}
