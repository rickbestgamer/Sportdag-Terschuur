import { AdminMember } from "../../Items/Member/AdminMember";
import { HubFactory } from "../../LinksHubs/HubFactory";
import { AdminMemberLinkHub } from "../../LinksHubs/MemberLinkHub";
import { ServerMember } from "../../Types";
import { AdminBaseHub } from "../AdminBaseHub";
import { MemberForm } from "../../Elements/Forms/MemberForm";
import { AdminTeamLinkHub } from "../../LinksHubs/TeamLinkHub";

export class AdminMemberHub extends AdminBaseHub<AdminMember> {
	private MemberHub: AdminMemberLinkHub;
	private TeamHub: AdminTeamLinkHub;
	private Form = new MemberForm();

	constructor(wrapper: HTMLElement, memberForm?: HTMLFormElement) {
		super(wrapper, memberForm);

		wrapper.append(this.Form.Element);

		this.Form.Submit = async (form) => {
			return await this.MemberHub.CreateMember(form.FirstName.value, form.LastName.value, form.Team.Select.ID == 0 ? undefined : form.Team.Select.ID);
		};

		this.Form.IsDuplicate = () => {
			console.log(this.Items.some((m) => m.FirstName == this.Form.FirstName.value && m.LastName == this.Form.LastName.value));
			return this.Items.some((m) => {
				m.FirstName == this.Form.FirstName.value && m.LastName == this.Form.LastName.value;
			});
		};

		this.MemberHub = HubFactory.GetInstance(AdminMemberLinkHub);
		this.MemberHub.OnCreate((linkItem) => this.CreateItem(linkItem));
		this.MemberHub.OnUpdate((item) => {
			const member = this.Items.get(item.id);
			if (!member) return;
			member.FirstName = item.firstName;
			member.LastName = item.lastName;
			member.Present = item.present;
			member.TeamID = item.sdTeam_ID ?? 0;
		});
		this.MemberHub.OnDelete((member) => {
			this.Items.delete(member.id);
		});

		this.TeamHub = HubFactory.GetInstance(AdminTeamLinkHub);
		this.TeamHub.OnCreate((team) => this.Form.Team.Select.CreateOption(team.id, team.name));
		this.TeamHub.OnUpdate((team) => this.Form.Team.Select.UpdateOption(team.id, team.name));
		this.TeamHub.OnDelete((team) => this.Form.Team.Select.DeleteOption(team.id));
	}

	protected ConstructItem = (item: ServerMember): AdminMember => {
		const member = new AdminMember(item, this.MemberHub.UpdateMember, this.MemberHub.DeleteMember);
		return member;
	};
}
