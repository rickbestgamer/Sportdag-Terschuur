import { Select } from "../../../Elements/Select/Select";
import { AdminBaseElement } from "../AdminBaseElement";
import { BaseTrainerCard } from "./BaseTrainerCard";

export class AdminTrainerCard extends BaseTrainerCard {
	NameInput = document.createElement("input");
	Team = new Select();
	Admin: AdminBaseElement;

	constructor() {
		super();
		this.NameInput.required = true;
		this.RoleDis = false;
		this.Team.Update = this._Update;
		this.TeamWrapper.append(this.Team.Element);
		this.Admin = new AdminBaseElement(this, this._Update, this._Delete);
	}

	Update?: (arg: AdminTrainerCard) => Promise<unknown>;
	Delete?: (arg: AdminTrainerCard) => Promise<unknown>;

	protected _Update = async (): Promise<unknown> => {
		return await this.Update?.(this);
	};
	protected _Delete = async (): Promise<unknown> => {
		return await this.Delete?.(this);
	};
}
