import { BaseLinkItem } from "./BaseLinkItem";
import { AdminMember } from "../../Items/Member";
import { AdminBaseLinkItem } from "./AdminBaseLinkItem";

export class MemberLink extends BaseLinkItem {
	private _FName: string;
	private _LName: string;

	constructor(id: number, fName: string, lName: string) {
		super(id, fName + " " + lName);

		this._FName = fName;
		this._LName = lName;
	}

	set FName(name: string) {
		this._FName = name;
		this.Name = name + " " + this._LName;
	}

	set LName(name: string) {
		this._LName = name;
		this.Name = this._FName + " " + name;
	}
}

export class AdminMemberLink extends AdminBaseLinkItem {
	private _Member: AdminMember;

	constructor(id: number, fName: string, lName: string, member: AdminMember) {
		super(id, fName + " " + lName);

		this._Member = member;
	}

	UpdateTeamID = (teamID: number) => {
		if (this._Member.TeamSelect) this._Member.TeamSelect.ID = teamID;
	};
}
