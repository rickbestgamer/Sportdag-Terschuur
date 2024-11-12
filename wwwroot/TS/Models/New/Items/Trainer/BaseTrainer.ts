import { ServerTrainer } from "../../Types";
import { BaseItem } from "../BaseItem";
import { BaseTrainerCard } from "../Elements/Trainer/BaseTrainerCard";

export abstract class BaseTrainer extends BaseItem {
	abstract Card: BaseTrainerCard;
	private _Role = true;
	private _Name = "";
	private _TeamID = 0;

	constructor(item: ServerTrainer) {
		super(item.id);
	}

	Remove = () => {
		this.Card.Element.remove();
	};

	get Role(): boolean {
		return this._Role;
	}

	set Role(bool: boolean) {
		this._Role = bool;
		this.Card.RoleCheck = bool;
	}

	get Name(): string {
		return this._Name;
	}

	set Name(name: string) {
		this._Name = name;
		this.Card.NameSpan.textContent = name;
	}

	get TeamID(): number {
		return this._TeamID;
	}

	set TeamID(id: number) {
		this._TeamID = id;
	}
}
