import { Select } from "../GeneralItems";
import { AdminMember, Member } from "../Items/Member";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminMemberLinkHub } from "../Links/Hubs/MemberLinkHub";
import { AdminBaseHub } from "./AdminBaseHub";
import { BaseHub } from "./BaseHub";

export class AdminMemberHub extends AdminBaseHub<AdminMember> {
	private LinkHub: AdminMemberLinkHub;
	private TeamSelect: Select = new Select();

	constructor(wrapper: HTMLElement, memberForm?: HTMLFormElement) {
		super(wrapper, "MemberHub", memberForm);

		if (memberForm) this.HandleFormSubmission(memberForm);

		this.Hub

		this.LinkHub = HubFactory.GetInstance(AdminMemberLinkHub);
	}

	protected ConstructItem = (card: HTMLElement): AdminMember => {
		const member = new AdminMember(card, this.Update, this.Delete);

		this.LinkHub.CreateMember(member);

		return member;
	};

	protected ExtendServerUpdate = (item: AdminMember, present: boolean, firstName: string, lastName: string, teamID: number | undefined): void => {
		item.Data.FirstName = firstName;
		item.Data.LastName = lastName;
		item.Data.Present.checked = present;
		if (item.TeamSelect) item.TeamSelect.ID = teamID ?? 0;

		this.LinkHub.UpdateMember(item);
	};

	protected ExtendServerDelete = (item: AdminMember) => {
		item.Card.remove();

		this.Items = this.Items.filter((m) => m !== item);

		this.LinkHub.DeleteMember(item);
	};

	private HandleFormSubmission = (form: HTMLFormElement) => {
		const firstName = form.querySelector("input#NewMemberFirst") as HTMLInputElement | null;
		const lastName = form.querySelector("input#NewMemberLast") as HTMLInputElement | null;
		const teamWrapper = form.querySelector(".TeamWrapper") as HTMLElement | null;

		if (!firstName) return console.error("Input field for first name for creating members was not found");
		if (!lastName) return console.error("Input field for last name for creating members was not found");
		if (!teamWrapper) console.warn("There was no wrapper found to add the select that links the new member to a team");

		teamWrapper?.appendChild(this.TeamSelect.Element);

		form.addEventListener("submit", async (e: SubmitEvent) => {
			e.preventDefault();

			const trimmedFirst = firstName.value.trim();
			const trimmedLast = lastName.value.trim();

			if (trimmedFirst === "" || trimmedLast === "" || this.IsDuplicateMember(trimmedFirst, trimmedLast)) return;

			await this.ExecuteCreate(async () => await this.Hub.Create(trimmedFirst, trimmedLast, this.TeamSelect.ID));

			form.reset();
			this.TeamSelect.ID = 0;
		});
	};

	private IsDuplicateMember = (first: string, last: string): boolean => {
		return this.Items.some((i) => i.Data.FirstName.trim().toLowerCase() === first.toLowerCase() && i.Data.LastName.trim().toLowerCase() === last.toLowerCase());
	};

	private Update = async (member: AdminMember): Promise<unknown> => {
		return await this.Hub.Update(member.ID, member.Data.Present.checked, member.Data.FirstName, member.Data.LastName, member.TeamSelect?.ID);
	};
	private Delete = async (member: AdminMember): Promise<unknown> => {
		return await this.Hub.Delete(member.ID);
	};
}

export class MemberHub extends BaseHub<Member> {
	constructor(wrapper: HTMLElement) {
		super(wrapper, "MemberHub");
	}

	protected ConstructItem = (card: HTMLElement): Member => {
		return new Member(card, this.Update);
	};

	protected ExtendServerUpdate = (item: Member, present: boolean, firstName: string, lastName: string, teamID: number | undefined): void => {
		item.Data.FirstName = firstName;
		item.Data.LastName = lastName;
		item.Data.Present.checked = present;
	};

	protected ExtendServerDelete = (item: Member) => {
		item.Card.remove();

		this.Items = this.Items.filter((m) => m !== item);
	};

	Update = async (member: Member): Promise<unknown> => {
		return await this.Hub.Update(member.ID, member.Data.Present.checked, member.Data.FirstName, member.Data.LastName);
	};
}
