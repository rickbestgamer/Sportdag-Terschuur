import { ServerTeam } from "../../Types";
import { BaseItem } from "../BaseItem";
import { BaseTeamCard } from "../Elements/Team/BaseTeamCard";

export abstract class BaseTeam extends BaseItem {
	abstract Card: BaseTeamCard<any>;
	private _Name = "";
	private _MemberIDS = new Set<number>();
	private _TrainerIDS = new Set<number>();

	constructor(item: ServerTeam) {
		super(item.id);
	}

	_AddMember = (id: number) => {
		this._MemberIDS.add(id);
	};

	_DelMember = (id: number) => {
		this._MemberIDS.delete(id);
	};

	_AddTrainer = (id: number) => {
		this._TrainerIDS.add(id);
	};

	_DelTrainer = (id: number) => {
		this._TrainerIDS.delete(id);
	};

	Remove = () => {
		this.Card.Element.remove();
	};

	get Name(): string {
		return this._Name;
	}

	set Name(name: string) {
		this._Name = name;
		this.Card.NameSpan.textContent = name;
	}

	get MemberIDS(): Set<number> {
		return this._MemberIDS;
	}

	set MemberIDS(set: Set<number>) {
		this._MemberIDS = set;
	}

	get TrainerIDS(): Set<number> {
		return this._TrainerIDS;
	}

	set TrainerIDS(set: Set<number>) {
		this._TrainerIDS = set;
	}
}
