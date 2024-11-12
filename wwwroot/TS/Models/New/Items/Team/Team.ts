import { ListItem, ListWrapper } from "../../GeneralItems";
import { ServerMember, ServerTeam, ServerTrainer } from "../../Types";
import { TeamCard } from "../Elements/Team/TeamCard";
import { BaseTeam } from "./BaseTeam";

export class Team extends BaseTeam {
	Card = new TeamCard();

	constructor(item: ServerTeam) {
		super(item);
		this.Name = item.name;

		

		for (const member of item.sdTeamMembers) {
			const element = new ListItem(member.firstName + " " + member.lastName);
			this.Card.MemberWrapper.Add(element, member.id, element.Element);
		}

		for (const trainer of item.sdUsers) {
			const element = new ListItem(trainer.name);
			this.Card.MemberWrapper.Add(element, trainer.id, element.Element);
		}
	}

	AddMember = (item: ServerMember) => {
		this._AddTrainer(item.id);
		const element = new ListItem(item.firstName + " " + item.lastName);
		this.Card.MemberWrapper.Add(element, item.id, element.Element);
	};

	RemoveMember = (id: number) => {
		this._DelMember(id);
		this.Card.MemberWrapper.Remove(id);
	};

	AddTrainer(item: ServerTrainer) {
		this._AddTrainer(item.id);
		const element = new ListItem(item.name);
		this.Card.TrainerWrapper.Add(element, item.id, element.Element);
	}

	RemoveTrainer = (id: number) => {
		this._DelTrainer(id);
		this.Card.TrainerWrapper.Remove(id);
	};
}
