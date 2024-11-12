import { AdminDeleteTypes, AdminUpdateTypes, ServerMember } from "../Types";
import { BaseLinkHub } from "./BaseLinkHub";
import { AdminBaseLinkHub } from "./AdminBaseLinkHub";
import { AdminMember } from "../Items/Member/AdminMember";
import { Member } from "../Items/Member/Member";

export class AdminMemberLinkHub extends AdminBaseLinkHub<AdminMember> {
	constructor() {
		super("MemberHub");
		this.ServerReview = this.ReviewMember;
	}

	CreateMember = (firstName:string, lastName: string, teamID?:number) => {
		return this.Hub.Create(firstName, lastName, teamID);
	};

	ReviewMember = (members: ServerMember[]) => {
		for (const member of members) {
			for (const cb of this.CreateCB) cb(member);
			this.IC.Add(member);
		}
	};

	UpdateMember = (...arg: AdminUpdateTypes<AdminMember>) => {
		return this.Hub.Update(...arg);
	};

	DeleteMember = (...arg: AdminDeleteTypes<AdminMember>) => {
		return this.Hub.Delete(...arg);
	};
}

export class MemberLinkHub extends BaseLinkHub<Member> {
	constructor() {
		super("MemberHub");
		this.ServerReview = this.ReviewMember;
	}

	ReviewMember = (members: ServerMember[]) => {
		for (const member of members) {
			for (const cb of this.CreateCB) cb(member);
			this.IC.Add(member);
		}
	};
}
