import { AdminBaseElement } from "../AdminBaseElement";
import { BaseMemberCard } from "./BaseMemberCard";
import { Select } from '../../../Elements/Select/Select';

export class AdminMemberCard extends BaseMemberCard {
	FirstNameInput = document.createElement("input");
	LastNameInput = document.createElement("input");
	Team = new Select();
	Admin: AdminBaseElement;

	constructor() {
		super();
		this.FirstNameInput.required = true;
		this.LastNameInput.required = true;
		this.PresentDis = false;
		this.Team.Update = this._Update;
		this.TeamWrapper.append(this.Team.Element);
		this.Admin = new AdminBaseElement(this, this._Update, this._Delete);
	}

	Update?: (arg: AdminMemberCard) => Promise<unknown>;
	Delete?: (arg: AdminMemberCard) => Promise<unknown>;

	protected _Update = async (): Promise<unknown> => {
		return await this.Update?.(this);
	};
	protected _Delete = async (): Promise<unknown> => {
		return await this.Delete?.(this);
	};
}
