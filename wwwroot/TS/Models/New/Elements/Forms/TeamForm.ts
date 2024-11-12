import { BaseForm } from "./BaseForm";
import { InputLabel } from "./InputLabel";

export class TeamForm extends BaseForm {
	Name = new InputLabel<"text">();
	Submit?: (form: TeamForm) => Promise<unknown>;

	constructor() {
		super();
		this.Name = this.CreateInput(this.Name, {
			ClassName: "Team",
			Name: "Name",
			Placeholder: "Name",
			Type: "text",
			Required: true,
		});
		this.Element.append(this.Name.Element, this.SubmitButton);
	}

	ServerSubmit = async () => {
		return await this.Submit?.(this);
	};
	
    Reset = () => {
		this.Name.value = "";
	};
}
