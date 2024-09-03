import { TypedEventEmitter } from "../../Functions";
import { BaseHubTeam } from "./BaseHubTeam";
import { Trainer } from "../Items/Trainer";
import { HubEvents, ItemTypes, Update } from "../Types";
import { BaseHub } from "./BaseHub";

export class TrainerHub extends BaseHub<Trainer> {
	TeamHub: BaseHubTeam<Trainer>;
	constructor(trainerWrapper: HTMLElement, funcCallBack: TypedEventEmitter<HubEvents>, newTrainer?: HTMLFormElement) {
		super(
			trainerWrapper,
			newTrainer,
			funcCallBack,
			"TrainerHub",
			Trainer,
			async (trainer) => await this.Hub.Update(trainer.ID, trainer.Name, trainer.Role.checked ? 0 : 1, trainer.ItemTeams.Select.ItemID),
			async (trainer) => await this.Hub.Delete(trainer.ID)
		);
		this.TeamHub = new BaseHubTeam(this, funcCallBack);

		if (newTrainer) {
			const role = newTrainer.querySelector("input#NewRole") as HTMLInputElement;
			this.TeamHub.NewSelect = newTrainer.querySelector("select.Team") ?? undefined;
			const NewNameInput = newTrainer.querySelector("input#NewTrainerName") as HTMLInputElement;
			newTrainer.addEventListener("submit", async (e: SubmitEvent) => {
				e.preventDefault();
				if (NewNameInput.value == "" || this.Items.find((t) => t.Name == NewNameInput.value) != undefined) return;
				await this.CreateItem(async () => this.Hub.Create(NewNameInput.value, role.checked ? 0 : 1, this.TeamHub.Teams.find((t) => t.Options.find((o) => o == this.TeamHub.NewSelect!.selectedOptions[0]))?.ID));
				NewNameInput.value = "";
				role.checked = false;
				this.TeamHub.NewSelect!.selectedIndex = 0;
			});
		}
	}
	protected ExtendAdd= (item: Trainer) => {
		for (const team of this.TeamHub.Teams) {
			item.ItemTeams.Select.CreateOption(team.ID, team.Name)
		}
	};

	protected ExtendServerUpdate = (item: Trainer, ...arg: ItemTypes<Trainer>) => {
		item.Role.checked = arg[2] == 0 ? true : false;
		item.Name = arg[1];
	};
}
