import { AdminTeam } from "../Items/Team/AdminTeam";
import { AdminDeleteTypes, AdminUpdateTypes, ServerTeam } from "../Types";
import { AdminBaseLinkHub } from "./AdminBaseLinkHub";

export class AdminTeamLinkHub extends AdminBaseLinkHub<AdminTeam> {
	constructor() {
		super("TeamHub");
		this.ServerReview = this.ReviewTeam;
	}

	CreateTeam = (team: AdminTeam) => {
		return this.Hub.Create(team.Name);
	};

	ReviewTeam = (teams: ServerTeam[]) => {
		for (const team of teams) {
			for (const cb of this.CreateCB) cb(team);
			this.IC.Add(team);
		}
	};

	UpdateTeam = (...arg: AdminUpdateTypes<AdminTeam>) => {
		return this.Hub.Update(...arg);
	};

	DeleteTeam = (...arg: AdminDeleteTypes<AdminTeam>) => {
		return this.Hub.Delete(...arg);
	};
}

// export class TeamLinkHub extends BaseLinkHub<Team> {}
