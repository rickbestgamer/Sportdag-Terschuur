import { SelectWrapper } from "../GeneralItems";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminMemberLinkHub } from "../Links/Hubs/MemberLinkHub";
import { AdminTrainerLinkHub } from "../Links/Hubs/TrainerLinkHub";
import { AdminBaseItem } from "./AdminBaseItem";
import { BaseItem } from "./BaseItem";

class TeamBaseData {
	private _Name: string = "";
	NameSpan: HTMLSpanElement;

	private Input?: HTMLInputElement;

	constructor(card: HTMLElement, input?: HTMLInputElement) {
		this.Input = input;
		this.NameSpan = card.querySelector("span.TeamName")!;
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

export class AdminTeam extends AdminBaseItem<AdminTeam> {
	Data: TeamBaseData;
	NameInput: HTMLInputElement;
	MemberWrapper?: SelectWrapper;
	TrainerWrapper?: SelectWrapper;
	protected Update: (arg: AdminTeam) => Promise<unknown>;
	protected Delete: (arg: AdminTeam) => Promise<unknown>;

	constructor(card: HTMLElement, updateT: (arg: AdminTeam) => Promise<unknown>, deleteT: (arg: AdminTeam) => Promise<unknown>) {
		super(card);

		this.NameInput = card.querySelector("input.TeamName")!;

		this.Data = new TeamBaseData(card, this.NameInput);
		this.Update = updateT;
		this.Delete = deleteT;

		const memberWrapper = card.querySelector(".MemberWrapper");
		const trainerWrapper = card.querySelector(".LeaderWrapper");

		if (memberWrapper) {
			this.MemberWrapper = new SelectWrapper(memberWrapper as HTMLElement);
			this.MemberWrapper!.CreateSelect(0);

			HubFactory.GetInstance(AdminMemberLinkHub).RegAdd((item) => {
				if (this.MemberWrapper!.ItemIDS.has(item.ID)) return this.MemberWrapper!.AddSelect(item.CreateSelect());
				this.MemberWrapper!.Selects.forEach((Select) => {
					Select.AddOption(item.CreateOption());
				});
			});
		}

		if (trainerWrapper) {
			this.TrainerWrapper = new SelectWrapper(trainerWrapper as HTMLElement);
			this.TrainerWrapper!.CreateSelect(0);

			HubFactory.GetInstance(AdminTrainerLinkHub).RegAdd((item) => {
				if (this.TrainerWrapper!.ItemIDS.has(item.ID)) return this.TrainerWrapper!.AddSelect(item.CreateSelect());
				this.TrainerWrapper!.Selects.forEach((Select) => {
					Select.AddOption(item.CreateOption());
				});
			});
		}
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

export class Team extends BaseItem {
	Data: TeamBaseData;

	constructor(card: HTMLElement) {
		super(card);
		this.Data = new TeamBaseData(card);
	}
}
