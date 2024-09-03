import { TypedEventEmitter } from "../../Functions";
import { BaseHubTeam } from "./BaseHubTeam";
import { Member } from '../Items/Member';
import { HubEvents, ItemTypes } from "../Types";
import { BaseHub } from "./BaseHub";

export class MemberHub extends BaseHub<Member> {
	TeamHub: BaseHubTeam<Member>;

	constructor(memberWrapper: HTMLElement, funcCallBack: TypedEventEmitter<HubEvents>, newForm?: HTMLFormElement) {
		super(
			memberWrapper,
			newForm,
			funcCallBack,
			"MemberHub",
			Member,
			async (member) => await this.Hub.Update(member.ID, member.Present.checked, member.FirstName, member.LastName, member.ItemTeams.Select.ItemID),
			async (member) => await this.Hub.Delete(member.ID)
		);
		this.TeamHub = new BaseHubTeam(this, funcCallBack);

		if (newForm) {
			this.TeamHub.NewSelect = newForm.querySelector("select.Team")!;
			const firstName = newForm.querySelector("input#NewMemberFirst") as HTMLInputElement;
			const lastName = newForm.querySelector("input#NewMemberLast") as HTMLInputElement;
			const Team = this.TeamHub.NewSelect!;
			newForm.addEventListener("submit", async (e: SubmitEvent) => {
				e.preventDefault();
				if (firstName.value === "" || lastName.value === "" || this.Items.find((i) => i.FirstName == firstName.value && i.LastName == lastName.value) != undefined) return;
				await this.CreateItem(async () => await this.Hub.Create(firstName.value, lastName.value, this.TeamHub.Teams.find((t) => t.Options.find((o) => o == this.TeamHub.NewSelect?.selectedOptions[0]))?.ID));
				firstName.value = "";
				lastName.value = "";
				Team.selectedIndex = 0;
			});
		}
	}

	protected ExtendAdd = (item: Member) => {
		for (const team of this.TeamHub.Teams) {
			item.ItemTeams.Select.CreateOption(team.ID, team.Name);
		}
	};

	protected ExtendServerUpdate = (member: Member, ...arg: ItemTypes<Member>) => {
		member.Present.checked = arg[1];
		member.FirstName = arg[2];
		member.LastName = arg[3];
	};
}
