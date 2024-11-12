import { ServerTrainer } from "../../Types";
import { TrainerCard } from "../Elements/Trainer/TrainerCard";
import { BaseTrainer } from "./BaseTrainer";

export class Trainer extends BaseTrainer {
	Card = new TrainerCard();
	protected _Team = "";

	constructor(item: ServerTrainer) {
		super(item);
	}

	set Role(bool: boolean) {
		super.Role = bool;
		this.Card.RoleCheck = bool;
	}

	get TeamName(): string {
		return this._Team;
	}

	set TeamName(team: string) {
		this._Team = team;
		this.Card.Team.textContent = team;
	}
}
