import { AdminDeleteTypes, AdminUpdateTypes, ServerTrainer } from "../../Types";
import { AdminTrainerCard } from "../Elements/Trainer/AdminTrainerCard";
import { BaseTrainer } from "./BaseTrainer";

export class AdminTrainer extends BaseTrainer {
	Card = new AdminTrainerCard();
	protected _Update: (...arg: AdminUpdateTypes<AdminTrainer>) => Promise<unknown>;
	protected _Delete: (...arg: AdminDeleteTypes<AdminTrainer>) => Promise<unknown>;

	constructor(item: ServerTrainer, updateT: (...arg: AdminUpdateTypes<AdminTrainer>) => Promise<unknown>, deleteT: (...arg: AdminDeleteTypes<AdminTrainer>) => Promise<unknown>) {
		super(item);

		this.Name = item.name;
		this.Role = item.role;
		if (item.sdTeam_ID) this.TeamID = item.sdTeam_ID;

		this._Update = updateT;
		this._Delete = deleteT;

		if (item.sdTeam_ID && item.sdTeam_Name) this.Card.Team.CreateOption(item.sdTeam_ID, item.sdTeam_Name);

		this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.RoleWrapper, this.Card.TeamWrapper, this.Card.Admin.DeleteButton);

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
	}

	Update = async () => {
		return await this._Update(this.ID, this.Card.NameInput.value, this.Card.RoleCheck, this.Card.Team.ID);
	};

	Delete = async () => {
		return await this._Delete(this.ID);
	};

	set TeamID(id: number) {
		super.TeamID = id;
		this.Card.Team.ID = id;
	}
}
