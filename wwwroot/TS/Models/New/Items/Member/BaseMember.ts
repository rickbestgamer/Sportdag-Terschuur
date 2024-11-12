import { ServerMember } from "../../Types";
import { BaseItem } from "../BaseItem";
import { BaseMemberCard } from "../Elements/Member/BaseMemberCard";

export abstract class BaseMember extends BaseItem {
	abstract Card: BaseMemberCard;
	private _Present = true;
	private _FirstName = "";
	private _LastName = "";
	private _TeamID = 0;

	constructor(item: ServerMember) {
		super(item.id);
	}

	Remove = () => {
		this.Card.Element.remove();
	};

	get Present(): boolean {
		return this._Present;
	}

	set Present(bool: boolean) {
		this._Present = bool;
		this.Card.PresentCheck = bool;
	}

	get FirstName(): string {
		return this._FirstName;
	}

	set FirstName(name: string) {
		this._FirstName = name;
		this.Card.NameSpan.textContent = name + " " + this._LastName;
	}

	get LastName(): string {
		return this._LastName;
	}

	set LastName(name: string) {
		this._LastName = name;
		this.Card.NameSpan.textContent = this._FirstName + " " + name;
	}

	get TeamID(): number {
		return this._TeamID;
	}

	set TeamID(id: number) {
		this._TeamID = id;
	}
}
