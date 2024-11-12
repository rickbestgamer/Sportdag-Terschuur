import { ServerMember } from "../../Types";
import { MemberCard } from "../Elements/Member/MemberCard";
import { BaseMember } from "./BaseMember";

export class Member extends BaseMember {
	Card = new MemberCard();
	private _TeamName = "";

	constructor(item: ServerMember) {
		super(item);

		this.FirstName = item.firstName;
		this.LastName = item.lastName;
		this.Present = item.present;

		if (item.sdTeam_Name) this.TeamName = item.sdTeam_Name;

		this.Card.Element.append(this.Card.NameWrapper, this.Card.PresentWrapper, this.Card.TeamWrapper);
	}

	get TeamName(): string {
		return this._TeamName;
	}

	set TeamName(team: string) {
		this._TeamName = team;
		this.Card.TeamName = team;
	}
}
