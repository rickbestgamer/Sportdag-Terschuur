import { Member } from "../../Items/Member/Member";
import { ServerMember } from "../../Types";
import { BaseHub } from "../BaseHub";

export class MemberHub extends BaseHub<Member> {
	constructor(wrapper: HTMLElement) {
		super(wrapper);
	}

	protected ConstructItem = (card: ServerMember): Member => {
		return new Member(card, this.Update);
	};

	protected ExtendServerUpdate = (item: Member, present: boolean, firstName: string, lastName: string, teamID: number | undefined): void => {
		item.Data.FirstName = firstName;
		item.Data.LastName = lastName;
		item.Data.Present.checked = present;
	};

	protected ExtendServerDelete = (item: Member) => {
		item.Card.remove();

		this.Items.filter((m) => m !== item);
	};

	Update = async (member: Member): Promise<unknown> => {
		// return await this.Hub.Update(member.ID, member.Data.Present.checked, member.Data.FirstName, member.Data.LastName);
		return;
	};
}
