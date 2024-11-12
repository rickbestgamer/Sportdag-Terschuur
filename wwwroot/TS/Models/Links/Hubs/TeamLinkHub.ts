import { AdminTeam } from "../../Items/Team";
import { AdminTeamLink, TeamLink } from "../Items/TeamLink";
import { BaseLinkHub } from "./BaseLinkHub";

export class AdminTeamLinkHub extends BaseLinkHub<AdminTeamLink> {
	CreateTeam = (team: AdminTeam) => {
		this.AddItem(new AdminTeamLink(team.ID, team.Data.Name, team));
	};

	UpdateTeam = (team: AdminTeam) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == team.ID) {
				tl.Name = team.Data.Name;
				this.UpdateItem(tl);
			}
		});
	};

	DeleteTeam = (team: AdminTeam) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == team.ID) {
				tl.DeleteOptions();
				this.DeleteItem(tl);
			}
		});
	};
}

export class TeamLinkHub extends BaseLinkHub<TeamLink> {}
