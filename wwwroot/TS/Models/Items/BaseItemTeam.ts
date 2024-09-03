import { GetAttributeId } from "../../Functions";
import { Option, SelectWrapper, Select } from "../Hubs/SignalRHub";
import { Hubs, Items, ItemsTeam } from "../Types";
import { BaseItemChild } from "./BaseItemChild";

export class BaseItemTeam<T extends Items> {
	// TeamID: number;
	// TeamSelect: HTMLSelectElement;
	// TeamOptions: Option[] = [];
	// TeamSelectedOption: string;
	Select: Select;

	constructor(parent: T, update: (arg: T) => Promise<unknown>) {
		// this.TeamSelect = parent.Card.querySelector("select.Team")!;
		// this.TeamSelect.addEventListener("change", );
		// this.TeamSelectedOption = this.TeamSelect.value;
		// this.TeamID = parseInt(this.TeamSelect.getAttribute("ID")!);
		// this.TeamSelect.removeAttribute("ID");
		this.Select = new Select({
			Id: GetAttributeId(parent.Card, "TeamID")[0],
			Update: async (select) => {
				select.Element.disabled = true;
				await update(parent);
				select.Element.disabled = false;
			},
		});
		parent.Card.querySelector(".SelectWrapper")?.appendChild(this.Select.Element);
	}
}

export class ItemTeam<T extends ItemsTeam> extends BaseItemChild {
	constructor(id: number, name: string, parents: T[]) {
		super(id, name);

		for (const parent of parents) {
			const option = this.CreateOption();

			option.Option.selected = parent.ItemTeams.Select.ItemID == this.ID ? true : false;

			parent.ItemTeams.Select.Element.add(option.Option);
			parent.ItemTeams.Select.Options.push(option);
			parent.ItemTeams.Select.SelectedOption = parent.ItemTeams.Select.Element.value;
		}
	}
}
