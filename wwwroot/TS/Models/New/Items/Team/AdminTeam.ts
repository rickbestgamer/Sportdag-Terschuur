import { AdminListItem } from "../../GeneralItems";
import { AdminDeleteTypes, AdminUpdateTypes, ServerMember, ServerTeam, ServerTrainer } from "../../Types";
import { AdminTeamCard } from "../Elements/Team/AdminTeamCard";
import { BaseTeam } from "./BaseTeam";
import { AdminMemberLinkHub } from "../../LinksHubs/MemberLinkHub";
import { HubFactory } from "../../LinksHubs/HubFactory";
import { AdminTrainerLinkHub } from "../../LinksHubs/TrainerLinkHub";

export class AdminTeam extends BaseTeam {
	Card = new AdminTeamCard();
	protected _Update: (...arg: AdminUpdateTypes<AdminTeam>) => Promise<unknown>;
	protected _Delete: (...arg: AdminDeleteTypes<AdminTeam>) => Promise<unknown>;
	private MemberLinkHub: AdminMemberLinkHub;
	private TrainerLinkHub: AdminTrainerLinkHub;

	constructor(item: ServerTeam, updateT: (...arg: AdminUpdateTypes<AdminTeam>) => Promise<unknown>, deleteT: (...arg: AdminDeleteTypes<AdminTeam>) => Promise<unknown>) {
		super(item);

		this.Name = item.name;

		this._Update = updateT;
		this._Delete = deleteT;

		this.MemberIDS = new Set(item.sdTeamMembers.map((m) => m.id));
		this.TrainerIDS = new Set(item.sdUsers.map((u) => u.id));

		this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.TrainerWrapper.Label, this.Card.TrainerWrapper.Wrapper, this.Card.MemberWrapper.Label, this.Card.MemberWrapper.Wrapper, this.Card.Admin.DeleteButton);

		this.Card.Admin.ExtendConfirmBefore = () => this.Card.NameInput.value !== "";

		this.Card.Update = this.Update;
		this.Card.Delete = this.Delete;

		this.Card.Admin.ToggleInputVis = () => {
			this.Card.Admin.ToggleAppend(this.Card.NameInput, this.Card.NameWrapper);
			this.Card.Admin.ToggleAppend(this.Card.NameSpan, this.Card.NameWrapper);
		};

		this.Card.Admin.ToggleInput = () => {
			this.Card.Admin.ToggleDisabled(this.Card.NameInput);
		};

		this.MemberLinkHub = HubFactory.GetInstance(AdminMemberLinkHub);
		this.TrainerLinkHub = HubFactory.GetInstance(AdminTrainerLinkHub);

		this.MemberLinkHub.OnCreate((item) => {
			if (this.ID == item.sdTeam_ID) return this.AddMember(item.id, item.firstName + " " + item.lastName);
			this.Card.MemberWrapper.Select.CreateOption(item.id, item.firstName + " " + item.lastName);
		});
		this.MemberLinkHub.OnUpdate((item) => {
			if (!item.sdTeam_ID || item.sdTeam_ID !== this.ID) {
				if (this.MemberIDS.has(item.id)) this.RemoveMember(item.id);
				return;
			}
			if (!this.MemberIDS.has(item.id)) this.AddMember(item.id, `${item.firstName} ${item.lastName}`);
		});
		this.MemberLinkHub.OnDelete((item) => {
			if (this.MemberIDS.has(item.id)) this.RemoveMember(item.id);
		});

		this.TrainerLinkHub.OnCreate((item) => {
			if (this.ID == item.sdTeam_ID) return this.AddTrainer(item.id, item.name);
			this.Card.TrainerWrapper.Select.CreateOption(item.id, item.name);
		});
		this.TrainerLinkHub.OnUpdate((item) => {
			if (!item.sdTeam_ID || item.sdTeam_ID !== this.ID) {
				if (this.TrainerIDS.has(item.id)) this.RemoveTrainer(item.id);
				return;
			}
			if (!this.TrainerIDS.has(item.sdTeam_ID)) this.AddTrainer(item.sdTeam_ID, item.name);
		});
		this.TrainerLinkHub.OnDelete((item) => {
			if (this.TrainerIDS.has(item.id)) this.RemoveTrainer(item.id);
		});
	}

	Update = async () => {
		return await this._Update(this.ID, this.Card.NameInput.value, Array.from(this.MemberIDS), Array.from(this.TrainerIDS));
	};

	Delete = async () => {
		return await this._Delete(this.ID);
	};

	set Name(name: string) {
		super.Name = name;
		this.Card.NameInput.value = name;
	}

	AddMember = (id: number, name: string) => {
		this._AddMember(id);
		const member = new AdminListItem(name, () => {
			this._DelMember(id);
			this.Update();
		});
		this.Card.MemberWrapper.Add(member, id, member.Element);
		this.Card.MemberWrapper.Select.DeleteOption(id);
	};

	RemoveMember = (id: number) => {
		this._DelMember(id);
		const item = this.Card.MemberWrapper.GetItem(id);
		item?.Element.remove();
		if (item) this.Card.MemberWrapper.Select.CreateOption(id, item.Text);
		this.Card.MemberWrapper.Remove(id);
	};

	AddTrainer = (id: number, name: string) => {
		this._AddTrainer(id);
		const trainer = new AdminListItem(name, () => {
			this._DelTrainer(id);
			this.Update();
		});
		this.Card.TrainerWrapper.Add(trainer, id, trainer.Element);
		this.Card.TrainerWrapper.Select.DeleteOption(id);
	};

	RemoveTrainer = (id: number) => {
		this._DelTrainer(id);
		const item = this.Card.TrainerWrapper.GetItem(id);
		item?.Element.remove();
		if (item) this.Card.TrainerWrapper.Select.CreateOption(id, item.Text);
		this.Card.TrainerWrapper.Remove(id);
	};
}
