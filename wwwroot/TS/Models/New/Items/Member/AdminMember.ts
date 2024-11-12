import { HubFactory } from "../../LinksHubs/HubFactory";
import { AdminTeamLinkHub } from "../../LinksHubs/TeamLinkHub";
import { AdminDeleteTypes, AdminUpdateTypes, ServerMember } from "../../Types";
import { AdminMemberCard } from "../Elements/Member/AdminMemberCard";
import { BaseMember } from "./BaseMember";

export class AdminMember extends BaseMember {
	Card = new AdminMemberCard();
	private TeamLinkHub: AdminTeamLinkHub;
	protected _Update: (...arg: AdminUpdateTypes<AdminMember>) => Promise<unknown>;
	protected _Delete: (...arg: AdminDeleteTypes<AdminMember>) => Promise<unknown>;

	constructor(item: ServerMember, updateM: (...arg: AdminUpdateTypes<AdminMember>) => Promise<unknown>, deleteM: (...arg: AdminDeleteTypes<AdminMember>) => Promise<unknown>) {
		super(item);

		this.FirstName = item.firstName;
		this.LastName = item.lastName;
		this.Present = item.present;
		if (item.sdTeam_ID) this.TeamID = item.sdTeam_ID;

		this.Card.PresentUpdate = () => {
			this.Update();
			this.Card.PresentCheck = !this.Card.PresentCheck;
		};

		this._Update = updateM;
		this._Delete = deleteM;

		this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.PresentWrapper, this.Card.TeamWrapper, this.Card.Admin.DeleteButton);

		this.Card.Admin.ExtendConfirmBefore = () => this.Card.FirstNameInput.value !== "" && this.Card.LastNameInput.value !== "";

		this.Card.Update = this.Update;
		this.Card.Delete = this.Delete;

		this.Card.Admin.ToggleInputVis = () => {
			this.Card.Admin.ToggleAppend(this.Card.FirstNameInput, this.Card.NameWrapper);
			this.Card.Admin.ToggleAppend(this.Card.LastNameInput, this.Card.NameWrapper);
			this.Card.Admin.ToggleAppend(this.Card.NameSpan, this.Card.NameWrapper);
		};

		this.Card.Admin.ToggleInput = () => {
			this.Card.Admin.ToggleDisabled(this.Card.FirstNameInput);
			this.Card.Admin.ToggleDisabled(this.Card.LastNameInput);
		};

		this.TeamLinkHub = HubFactory.GetInstance(AdminTeamLinkHub);

		this.TeamLinkHub.OnCreate((team) => {
			this.Card.Team.CreateOption(team.id, team.name);
		});
	}

	CreateTeamOption = (id: number, text: string) => {
		this.Card.Team.CreateOption(id, text);
	};

	Update = async () => {
		return await this._Update(this.ID, this.Card.PresentCheck, this.Card.FirstNameInput.value, this.Card.LastNameInput.value, this.Card.Team.ID);
	};

	Delete = async () => {
		return await this._Delete(this.ID);
	};

	get FirstName(): string {
		return super.FirstName;
	}

	set FirstName(name: string) {
		super.FirstName = name;
		this.Card.FirstNameInput.value = name;
	}

	get LastName(): string {
		return super.LastName;
	}

	set LastName(name: string) {
		super.LastName = name;
		this.Card.LastNameInput.value = name;
	}

	set TeamID(id: number) {
		super.TeamID = id;
		this.Card.Team.ID = id;
	}
}
