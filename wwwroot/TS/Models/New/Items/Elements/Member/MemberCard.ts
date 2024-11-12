import { BaseMemberCard } from "./BaseMemberCard";

export class MemberCard extends BaseMemberCard {
	private Team = document.createElement("p");

	constructor() {
		super();
		this.TeamWrapper.append(this.Team);
	}

	set TeamName(name: string) {
		this.Team.textContent = name;
	}
}
