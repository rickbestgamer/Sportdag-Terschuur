import { TypedEventEmitter } from "../../Functions";
import { BaseHub } from "./BaseHub";
import { Team } from "../Items/Team";
import { HubEvents, ItemTypes } from "../Types";
import { ItemMember } from "../Items/BaseItemMember";
import { ItemTrainer } from "../Items/BaseItemTrainer";

export class TeamHub extends BaseHub<Team> {
	Members: ItemMember<Team>[] = [];
	Trainers: ItemTrainer<Team>[] = [];
	constructor(wrapper: HTMLElement, funcCallBack: TypedEventEmitter<HubEvents>, newForm?: HTMLFormElement) {
		super(
			wrapper,
			newForm,
			funcCallBack,
			"TeamHub",
			Team,
			async (team) => await this.Hub.Update(team.ID, team.Name),
			async (team) => this.Hub.Delete(team.ID)
		);
		if (newForm) {
			const newTeamInput = newForm.querySelector("input#NewTeamName") as HTMLInputElement;
			newForm.addEventListener("submit", async (e: SubmitEvent) => {
				e.preventDefault();
				if (newTeamInput.value == "") return;
				await this.CreateItem(async () => await this.Hub.Create(newTeamInput.value));
				newTeamInput.value = "";
			});
		}
	}



	protected ExtendServerUpdate = (team: Team, ...args: ItemTypes<Team>) => {
		team.Name = args[1];
	};
}
