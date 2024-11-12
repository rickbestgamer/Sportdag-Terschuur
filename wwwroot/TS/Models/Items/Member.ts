import { AdminBaseItem } from "./AdminBaseItem";
import { BaseItem } from "./BaseItem";
import { Select } from "../GeneralItems";
import { GetAttributeId } from "../../Functions";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminTeamLinkHub } from "../Links/Hubs/TeamLinkHub";

class MemberBaseData<T extends BaseItem> {
	Present: HTMLInputElement;
	private _FirstName: string = "";
	private FInput?: HTMLInputElement;
	FirstNameSpan: HTMLSpanElement;
	private _LastName: string = "";
	private LInput?: HTMLInputElement;
	LastNameSpan: HTMLElement;

	constructor(card: HTMLElement, update: (arg: T) => Promise<unknown>, parent: T, fInput?: HTMLInputElement, lInput?: HTMLInputElement) {
		this.FInput = fInput;
		this.LInput = lInput;
		this.Present = card.querySelector("input.Present")!;
		this.Present.addEventListener("change", async () => {
			this.Present.disabled = true;
			await update(parent);
			this.Present.disabled = false;
		});

		this.FirstNameSpan = card.querySelector("span.FirstName")!;
		this.FirstName = card.getAttribute("FirstName")!;
		card.removeAttribute("FirstName");

		this.LastNameSpan = card.querySelector("span.LastName")!;
		this.LastName = card.getAttribute("LastName")!;
		card.removeAttribute("LastName");
	}

	get FirstName(): string {
		return this._FirstName;
	}

	set FirstName(name: string) {
		this._FirstName = name;
		this.FirstNameSpan.textContent = name;
		if (this.FInput) this.FInput.value = name;
	}

	get LastName(): string {
		return this._LastName;
	}

	set LastName(name: string) {
		this._LastName = name;
		this.LastNameSpan.textContent = name;
		if (this.LInput) this.LInput.value = name;
	}
}

export class AdminMember extends AdminBaseItem<AdminMember> {
	Data: MemberBaseData<AdminMember>;
	FirstNameInput: HTMLInputElement;
	LastNameInput: HTMLInputElement;
	TeamSelect: Select = new Select();
	protected Update: (arg: AdminMember) => Promise<unknown>;
	protected Delete: (arg: AdminMember) => Promise<unknown>;

	constructor(card: HTMLElement, updateM: (arg: AdminMember) => Promise<unknown>, deleteM: (arg: AdminMember) => Promise<unknown>) {
		super(card);

		this.FirstNameInput = card.querySelector("input.FirstName")!;
		this.LastNameInput = card.querySelector("input.LastName")!;

		this.Data = new MemberBaseData(card, updateM, this, this.FirstNameInput, this.LastNameInput);
		this.Update = updateM;
		this.Delete = deleteM;

		const teamWrapper = card.querySelector(".TeamWrapper");

		if (teamWrapper) {
			this.TeamSelect.ID = GetAttributeId(card, "TeamID").values().next().value ?? 0;
			this.TeamSelect.Update = () => {
				this.Update(this);
			};
			teamWrapper.appendChild(this.TeamSelect.Element);
		}

		const teamLink = HubFactory.GetInstance(AdminTeamLinkHub);
		teamLink.RegAdd((item) => {
			this.TeamSelect.AddOption(item.CreateOption());
		});
	}

	set TeamID(id: number) {
		this.TeamSelect!;
	}

	protected ExtendConfirmBefore = (): boolean => {
		if (this.FirstNameInput.value == "" && this.LastNameInput.value == "") return false;

		this.Data.FirstName = this.FirstNameInput.value;
		this.Data.LastName = this.LastNameInput.value;

		return true;
	};

	protected ItemInstance = () => {
		return this;
	};
}

export class Member extends BaseItem {
	Data: MemberBaseData<Member>;

	constructor(card: HTMLElement, update: (arg: Member) => Promise<unknown>) {
		super(card);
		this.Data = new MemberBaseData(card, update, this);
	}
}
