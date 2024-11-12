import { BaseForm } from "./BaseForm";
import { InputLabel } from "./InputLabel";
import { SelectWrapper } from "../Select/SelectWrapper";

export class MemberForm extends BaseForm {
	FirstName = new InputLabel<"text">();
	LastName = new InputLabel<"text">();
	Team = new SelectWrapper();
	Submit?: (form: MemberForm) => Promise<unknown>;

	constructor() {
		super();
		this.FirstName = this.CreateInput(this.FirstName, {
			ClassName: "Member",
			Name: "FirstName",
			Placeholder: "FirstName",
			Type: "text",
			Required: true,
		});
		this.LastName = this.CreateInput(this.LastName, {
			ClassName: "Member",
			Name: "LastName",
			Placeholder: "LastName",
			Type: "text",
			Required: true,
		});
		this.CreateSelect(this.Team.Select);

		this.Team.text = "Team"

		this.Element.append(this.FirstName.Element, this.LastName.Element, this.Team.Element, this.SubmitButton);
	}

	ServerSubmit = async () => {
		return await this.Submit?.(this);
	};

	Reset = () => {
		this.FirstName.value = "";
		this.LastName.value = "";
		this.Team.Select.ID = 0;
	};
}
