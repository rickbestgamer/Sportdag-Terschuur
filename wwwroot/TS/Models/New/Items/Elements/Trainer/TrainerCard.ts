import { BaseTrainerCard } from "./BaseTrainerCard";

export class TrainerCard extends BaseTrainerCard {
	Team = document.createElement("p");

	constructor() {
		super();
		this.TeamWrapper.append(this.Team);
	}

	set TeamName(name: string) {
		this.Team.textContent = name;
	}
}
