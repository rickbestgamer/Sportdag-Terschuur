import { AdminTrainer } from "../../Items/Trainer";
import { AdminBaseLinkItem } from "./AdminBaseLinkItem";
import { BaseLinkItem } from "./BaseLinkItem";

export class TrainerLink extends BaseLinkItem {
	constructor(id: number, name: string) {
		super(id, name);
	}
}

export class AdminTrainerLink extends AdminBaseLinkItem {
	private _Trainer: AdminTrainer;

	constructor(id: number, name: string, trainer: AdminTrainer) {
		super(id, name);

		this._Trainer = trainer;
	}

	UpdateTeamID = (teamID: number) => {
		if (this._Trainer.TeamSelect) this._Trainer.TeamSelect.ID = teamID;
	};
}
