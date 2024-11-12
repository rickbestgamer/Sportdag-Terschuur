import { AdminListWrapper } from "../../../GeneralItems";
import { AdminBaseElement } from "../AdminBaseElement";
import { BaseTeamCard } from "./BaseTeamCard";

export class AdminTeamCard extends BaseTeamCard<AdminListWrapper> {
	TrainerWrapper = new AdminListWrapper();
	MemberWrapper = new AdminListWrapper();
	NameInput = document.createElement("input");
	Admin: AdminBaseElement;

	constructor() {
		super();
		this.NameInput.required = true;
		this.Admin = new AdminBaseElement(this, this._Update, this._Delete);
		this.MemberWrapper.Label.textContent = "Members";
		this.MemberWrapper.AllowNull = true;
		this.TrainerWrapper.Label.textContent = "Leaders";
		this.TrainerWrapper.AllowNull = true;
	}

	Update?: (arg: AdminTeamCard) => Promise<unknown>;
	Delete?: (arg: AdminTeamCard) => Promise<unknown>;

	protected _Update = async (): Promise<unknown> => {
		return await this.Update?.(this);
	};
	protected _Delete = async (): Promise<unknown> => {
		return await this.Delete?.(this);
	};
}
