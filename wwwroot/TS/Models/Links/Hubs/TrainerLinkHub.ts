import { AdminTrainer } from "../../Items/Trainer";
import { AdminTrainerLink, TrainerLink } from "../Items/TrainerLink";
import { BaseLinkHub } from "./BaseLinkHub";

export class AdminTrainerLinkHub extends BaseLinkHub<AdminTrainerLink> {
	CreateTrainer = (trainer: AdminTrainer) => {
		this.AddItem(new AdminTrainerLink(trainer.ID, trainer.Data.Name, trainer));
	};

	UpdateTrainer = (team: AdminTrainer) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == team.ID) {
				tl.Name = team.Data.Name;
				this.UpdateItem(tl);
			}
		});
	};

	DeleteTrainer = (team: AdminTrainer) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == team.ID) {
				tl.DeleteOptions();
				this.DeleteItem(tl);
			}
		});
	};
}

export class TrainerLinkHub extends BaseLinkHub<TrainerLink> {}
