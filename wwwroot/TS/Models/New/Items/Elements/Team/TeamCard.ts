import { ListWrapper } from "../../../GeneralItems";
import { BaseTeamCard } from "./BaseTeamCard";

export class TeamCard extends BaseTeamCard {
	TrainerWrapper = new ListWrapper();
	MemberWrapper = new ListWrapper();
	constructor() {
		super();
		this.MemberWrapper.Label.textContent = "Members";
		this.TrainerWrapper.Label.textContent = "Leaders";
	}
}
