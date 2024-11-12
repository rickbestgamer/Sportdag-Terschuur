import { AdminTeam } from "../../Items/Team/AdminTeam";
import { HubFactory } from "../../LinksHubs/HubFactory";
import { AdminTeamLinkHub } from "../../LinksHubs/TeamLinkHub";
import { ServerTeam } from "../../Types";
import { AdminBaseHub } from "../AdminBaseHub";
import { TeamForm } from "../../Elements/Forms/TeamForm";

export class AdminTeamHub extends AdminBaseHub<AdminTeam> {
	private Form = new TeamForm();
	private TeamLinkHub: AdminTeamLinkHub;

	constructor(wrapper: HTMLElement, teamForm?: HTMLFormElement) {
		super(wrapper, teamForm);

		this.Wrapper.append(this.Form.Element);

		this.TeamLinkHub = HubFactory.GetInstance(AdminTeamLinkHub);

		this.TeamLinkHub.OnCreate((item) => this.CreateItem(item));
		this.TeamLinkHub.OnUpdate((item) => {
			debugger;
			const team = this.Items.get(item.id);
			if (!team) return;
			team.Name = item.name;

			for (const member of item.sdTeamMembers) {
				if (!team.MemberIDS.has(member.id)) team.AddMember(member.id, member.firstName + " " + member.lastName);
			}

			for (const member of team.MemberIDS) {
				if (item.sdTeamMembers.length == 0) team.RemoveMember(member);
				if (!item.sdTeamMembers.find((m) => m.id === member)) team.RemoveMember(member);
			}

			for (const trainer of item.sdUsers) {
				if (!team.TrainerIDS.has(trainer.id)) team.AddTrainer(trainer.id, trainer.name);
			}

			for (const Trainer of team.TrainerIDS) {
				if (item.sdUsers.length == 0) team.RemoveTrainer(Trainer);
				if (!item.sdUsers.find((m) => m.id === Trainer)) team.RemoveTrainer(Trainer);
			}
		});
		this.TeamLinkHub.OnDelete((item) => {
			this.Items.get(item.id)?.Remove();
		});
	}

	protected ConstructItem = (card: ServerTeam): AdminTeam => {
		const team = new AdminTeam(card, this.TeamLinkHub.UpdateTeam, this.TeamLinkHub.DeleteTeam);
		return team;
	};
}
