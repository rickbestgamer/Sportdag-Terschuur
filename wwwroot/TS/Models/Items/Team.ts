import { Option, SelectWrapper } from "../Hubs/SignalRHub";
import { BaseItem } from "./BaseItem";
import { BaseItemMember } from "./BaseItemMember";
import { BaseItemTrainer } from "./BaseItemTrainer";

export class Team extends BaseItem<Team> {
	ItemMembers: BaseItemMember<Team>[] = [];
	ItemTrainers: BaseItemTrainer<Team>[] = [];

	private _Name: string = "";
	NameSpan: HTMLSpanElement;
	NameInput: HTMLInputElement;
	TrainerSelectWrapper: SelectWrapper;
	MemberSelectWrapper: SelectWrapper;
	Options: Option[] = [];

	constructor(card: HTMLElement, update: (arg: Team) => Promise<unknown>, Delete: (arg: Team) => Promise<unknown>) {
		super(card, update, Delete);
		this.NameSpan = card.querySelector("span.TeamName")!;
		this.NameInput = card.querySelector("input.TeamName")!;
		this.Name = card.getAttribute("Name")!;
		card.removeAttribute("Name");

		this.TrainerSelectWrapper = new SelectWrapper(card.querySelector("div.TeamLeader")!);
		this.MemberSelectWrapper = new SelectWrapper(card.querySelector("div.TeamMember")!);

		this.EditElements.push(this.NameSpan);
		this.EditInputs.push(this.NameInput);
		this.ExtendConfirmBefore = (): boolean => {
			if (this.NameInput.value == "") return false;
			this.Name = this.NameInput.value;
			return true;
		};
	}

	get Name(): string {
		return this._Name;
	}

	set Name(name: string) {
		this._Name = name;
		this.NameSpan.textContent = name;
		this.NameInput.value = name;
	}
}
