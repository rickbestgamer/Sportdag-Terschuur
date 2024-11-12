import { AdminTeam, Team } from "../Items/Team";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminTeamLinkHub } from "../Links/Hubs/TeamLinkHub";
import { AdminBaseHub } from "./AdminBaseHub";
import { BaseHub } from "./BaseHub";

export class AdminTeamHub extends AdminBaseHub<AdminTeam> {
	private LinkHub: AdminTeamLinkHub;

	constructor(wrapper: HTMLElement, teamForm?: HTMLFormElement) {
		super(wrapper, "TeamHub", teamForm);

		if (teamForm) this.HandleFormSubmission(teamForm);

		this.LinkHub = HubFactory.GetInstance(AdminTeamLinkHub);
	}

	protected ConstructItem = (card: HTMLElement): AdminTeam => {
		const team = new AdminTeam(card, this.Update, this.Delete);
		this.LinkHub.CreateTeam(team);
		return team;
	};

	protected ExtendServerUpdate = (item: AdminTeam, name: string): void => {
		item.Data.Name = name;
		this.LinkHub.UpdateTeam(item);
	};

	protected ExtendServerDelete = (item: AdminTeam): void => {
		item.Card.remove();
		this.Items = this.Items.filter((t) => t !== item);
		this.LinkHub.DeleteTeam(item);
	};

	private HandleFormSubmission = (form: HTMLFormElement) => {
		const name = form.querySelector("input#NewTeamName") as HTMLInputElement;

		if (!name) return console.error("Input field for name for creating teams was not found");

		form.addEventListener("submit", async (e: SubmitEvent) => {
			e.preventDefault();

			const trimmedName = name.value.trim();

			if (name.value === "" || this.IsDuplicateTeam(trimmedName)) return;

			await this.ExecuteCreate(async () => await this.Hub.Create(trimmedName));

			form.reset();
		});
	};

	private IsDuplicateTeam = (name: string) => {
		return this.Items.some((i) => i.Data.Name.trim().toLowerCase() === name.toLowerCase());
	};

	private Update = async (team: AdminTeam): Promise<unknown> => {
		return await this.Hub.Update(team.ID, team.Data.Name);
	};

	private Delete = async (team: Team): Promise<unknown> => {
		return await this.Hub.Delete(team.ID);
	};
}

export class TeamHub extends BaseHub<Team> {
	constructor(wrapper: HTMLElement) {
		super(wrapper, "TeamHub");
	}

	protected ConstructItem = (card: HTMLElement): Team => {
		return new Team(card);
	};

	protected ExtendServerUpdate = (item: Team, name: string): void => {
		item.Data.Name = name;
	};

	protected ExtendServerDelete = (item: Team): void => {
		item.Card.remove();
		this.Items = this.Items.filter((t) => t !== item);
	};
}
