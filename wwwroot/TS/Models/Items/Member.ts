import { Select } from "../Hubs/SignalRHub";
import { BaseItem } from "./BaseItem";
import { BaseItemTeam } from "./BaseItemTeam";

export class Member extends BaseItem<Member> {
	ItemTeams: BaseItemTeam<Member>;
	Present: HTMLInputElement;
	private _FirstName: string = "";
	FirstNameSpan: HTMLSpanElement;
	FirstNameInput: HTMLInputElement;
	private _LastName: string = "";
	LastNameSpan: HTMLElement;
	LastNameInput: HTMLInputElement;

	constructor(card: HTMLElement, update: (arg: Member) => Promise<unknown>, Delete: (arg: Member) => Promise<unknown>) {
		super(card, update, Delete);
		this.ItemTeams = new BaseItemTeam<Member>(this, update);
		this.Present = card.querySelector("input.Present")!;
		this.Present.addEventListener("change", async () => {
			this.Present.disabled = true;
			await update(this);
			this.Present.disabled = false;
		});

		this.FirstNameSpan = card.querySelector("span.FirstName")!;
		this.FirstNameInput = card.querySelector("input.FirstName")!;
		this.FirstName = card.getAttribute("FirstName")!;
		card.removeAttribute("FirstName");

		this.LastNameSpan = card.querySelector("span.LastName")!;
		this.LastNameInput = card.querySelector("input.LastName")!;
		this.LastName = card.getAttribute("LastName")!;
		card.removeAttribute("LastName");

		this.EditElements.push(this.FirstNameSpan, this.LastNameSpan);
		this.EditInputs.push(this.FirstNameInput, this.LastNameInput);
		this.ExtendConfirmBefore = (): boolean => {
			if (this.FirstNameInput.value == "" || this.LastNameInput.value == "") return false;
			this.FirstName = this.FirstNameInput.value;
			this.LastName = this.LastNameInput.value;
			return true;
		};
	}

	get FirstName(): string {
		return this._FirstName;
	}

	set FirstName(name: string) {
		this._FirstName = name;
		this.FirstNameSpan.textContent = name;
		this.FirstNameInput.value = name;
	}

	get LastName(): string {
		return this._LastName;
	}

	set LastName(name: string) {
		this._LastName = name;
		this.LastNameSpan.textContent = name;
		this.LastNameInput.value = name;
	}
}
