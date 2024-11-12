import { Select } from "../Select/Select";
import { SelectWrapper } from "../Select/SelectWrapper";
import { BaseForm } from "./BaseForm";
import { InputLabel } from "./InputLabel";

export class TrainerForm extends BaseForm {
	Name = new InputLabel<"text">();
	Team = new SelectWrapper();
	Submit?: (form: TrainerForm) => Promise<unknown>;

	constructor() {
		super();
		this.Name = this.CreateInput(this.Name, {
			ClassName: "Team",
			Name: "Name",
			Placeholder: "Name",
			Type: "text",
			Required: true,
		});
		this.CreateSelect(this.Team.Select);

		this.Team.text = "Team";

		this.Element.append(this.Name.Element, this.Team.Element, this.SubmitButton);
	}

	Reset = () => {
		this.Name.value = "";
		this.Team.Select.ID = 0;
	};

	ServerSubmit = async () => {
		return await this.Submit?.(this);
	};
}
