import { Team } from "../../Items/Team/Team";
import { ServerTeam } from "../../Types";
import { BaseHub } from "../BaseHub";

export class TeamHub extends BaseHub<Team> {
	constructor(wrapper: HTMLElement) {
		super(wrapper);
	}

	protected ConstructItem = (card: ServerTeam): Team => {
		return new Team(card);
	};

	protected ExtendServerUpdate = (item: Team, name: string): void => {
		item.Name = name;
	};

	protected ExtendServerDelete = (item: Team): void => {
		item.Remove();
		this.Items.filter((t) => t !== item);
	};
}
