import { GetAttributeId } from "../../Functions";
import { Select } from "../GeneralItems";
import { AdminBaseItem } from "./AdminBaseItem";
import { BaseItem } from "./BaseItem";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminTeamLinkHub } from "../Links/Hubs/TeamLinkHub";

class TrainerBaseData {
	private _Name: string = "";
	NameSpan: HTMLSpanElement;
	private Input?: HTMLInputElement;

	constructor(card: HTMLElement, input?: HTMLInputElement) {
		this.Input = input;
		this.NameSpan = card.querySelector("span.UserName")!;
		this.Name = card.getAttribute("Name")!;
		card.removeAttribute("Name");
	}

	get Name(): string {
		return this._Name;
	}

	set Name(name: string) {
		this._Name = name;
		this.NameSpan.textContent = name;
		if (this.Input) this.Input.value = name;
	}
}

export class AdminTrainer extends AdminBaseItem<AdminTrainer> {
	Data: TrainerBaseData;
	NameInput: HTMLInputElement;
	Role: HTMLInputElement;
	TeamSelect: Select = new Select();
	protected Update: (arg: AdminTrainer) => Promise<unknown>;
	protected Delete: (arg: AdminTrainer) => Promise<unknown>;

	constructor(card: HTMLElement, updateT: (arg: AdminTrainer) => Promise<unknown>, deleteT: (arg: AdminTrainer) => Promise<unknown>) {
		super(card);

		this.NameInput = card.querySelector("input.UserName")!;

		this.Role = card.querySelector("input.TrainerRole")!;
		this.Role.addEventListener("change", async () => {
			this.Role.disabled = true;
			this.Update(this);
			this.Role.disabled = false;
		});

		this.Data = new TrainerBaseData(card, this.NameInput);
		this.Update = updateT;
		this.Delete = deleteT;
		const teamWrapper = card.querySelector(".TeamWrapper");

		if (teamWrapper) {
			this.TeamSelect.ID = GetAttributeId(card, "TeamID").values().next().value ?? 0;
			this.TeamSelect.Update = () => {
				this.Update(this);
			};
			teamWrapper.appendChild(this.TeamSelect!.Element);
		}

		HubFactory.GetInstance(AdminTeamLinkHub).RegAdd((item) => {
			if (!this.TeamSelect) return;
			this.TeamSelect.AddOption(item.CreateOption());
		});
	}

	protected ExtendConfirmBefore = (): boolean => {
		if (this.NameInput.value == "") return false;

		this.Data.Name = this.NameInput.value;

		return true;
	};

	protected ItemInstance = () => {
		return this;
	};
}

export class Trainer extends BaseItem {
	Data: TrainerBaseData;

	constructor(card: HTMLElement) {
		super(card);
		this.Data = new TrainerBaseData(card);
	}
}
