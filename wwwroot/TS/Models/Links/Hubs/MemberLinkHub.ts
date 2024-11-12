import { BaseLinkHub } from "./BaseLinkHub";
import { AdminMemberLink, MemberLink } from "../Items/MemberLink";
import { AdminMember } from "../../Items/Member";

export class AdminMemberLinkHub extends BaseLinkHub<AdminMemberLink> {
	CreateMember = (member: AdminMember) => {
		this.AddItem(new AdminMemberLink(member.ID, member.Data.FirstName, member.Data.LastName, member));
	};

	UpdateMember = (member: AdminMember) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == member.ID) {
				tl.Name = member.Data.FirstName + " " + member.Data.LastName;
				this.UpdateItem(tl);
			}
		});
	};

	DeleteMember = (member: AdminMember) => {
		this.GetItems().forEach((tl) => {
			if (tl.ID == member.ID) {
				tl.DeleteOptions();
				this.DeleteItem(tl);
			}
		});
	};
}

export class MemberLinkHub extends BaseLinkHub<MemberLink> {}
