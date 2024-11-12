import { BaseLinkItem } from "./BaseLinkItem";
import { AdminTeam } from "../../Items/Team";
import { AdminBaseLinkItem } from "./AdminBaseLinkItem";

export class TeamLink extends BaseLinkItem {
	constructor(id: number, name: string) {
		super(id, name);
	}
}

export class AdminTeamLink extends AdminBaseLinkItem {
	private _Team: AdminTeam;

	constructor(id: number, name: string, team: AdminTeam) {
		super(id, name);

		this._Team = team;
	}

	UpdateMemberID = (oldID: number, newID: number) => {
		if (this._Team.MemberWrapper) {
			const select = this._Team.MemberWrapper.Selects.get(oldID);

			if (!select) return;

			select.ID = newID;

			this._Team.MemberWrapper.Selects.delete(oldID);
			this._Team.MemberWrapper.Selects.set(select.ID, select);
		}
	};

	UpdateTrainerID = (oldID: number, newID: number) => {
		if (this._Team.TrainerWrapper) {
			const select = this._Team.TrainerWrapper.Selects.get(oldID);

			if (!select) return;

			select.ID = newID;

			this._Team.TrainerWrapper.Selects.delete(oldID);
			this._Team.TrainerWrapper.Selects.set(select.ID, select);
		}
	};
}
