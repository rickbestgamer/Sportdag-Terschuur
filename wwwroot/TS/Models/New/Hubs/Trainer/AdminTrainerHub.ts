//#region  Imports
import { AdminTrainer } from "../../Items/Trainer/AdminTrainer";
import { HubFactory } from "../../LinksHubs/HubFactory";
import { AdminTrainerLinkHub } from "../../LinksHubs/TrainerLinkHub";
import { ServerTrainer } from "../../Types";
import { AdminBaseHub } from "../AdminBaseHub";
import { TrainerForm } from "../../Elements/Forms/TrainerForm";
import { AdminTeamLinkHub } from "../../LinksHubs/TeamLinkHub";

//#endregion

export class AdminTrainerHub extends AdminBaseHub<AdminTrainer> {
	private Form = new TrainerForm();
	private TeamLinkHub: AdminTeamLinkHub;
	private TrainerLinkHub: AdminTrainerLinkHub;

	constructor(wrapper: HTMLElement, trainerForm?: HTMLFormElement) {
		super(wrapper, trainerForm);

		wrapper.append(this.Form.Element);

		this.Form.Submit = async (form) => {
			return await this.TrainerLinkHub.CreateTrainer(form.Name.value, false, form.Team.Select.ID);
		};

		this.TrainerLinkHub = HubFactory.GetInstance(AdminTrainerLinkHub);
		this.TrainerLinkHub.OnCreate((item) => this.CreateItem(item));
		this.TrainerLinkHub.OnUpdate((item) => {
			const trainer = this.Items.get(item.id);
			if (!trainer) return;
			trainer.Name = item.name;
			trainer.Role = item.role;
			trainer.TeamID = item.sdTeam_ID ?? 0;
		});

		this.TeamLinkHub = HubFactory.GetInstance(AdminTeamLinkHub);
		this.TeamLinkHub.OnCreate((team) => this.Form.Team.Select.CreateOption(team.id, team.name));
		this.TeamLinkHub.OnUpdate((team) => this.Form.Team.Select.UpdateOption(team.id, team.name));
		this.TeamLinkHub.OnDelete((team) => this.Form.Team.Select.DeleteOption(team.id));
	}

	protected ConstructItem = (item: ServerTrainer): AdminTrainer => {
		const trainer = new AdminTrainer(item, this.TrainerLinkHub.UpdateTrainer, this.TrainerLinkHub.DeleteTrainer);
		return trainer;
	};
}
