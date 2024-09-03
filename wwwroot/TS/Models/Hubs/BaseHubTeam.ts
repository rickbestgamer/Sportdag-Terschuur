import { TypedEventEmitter } from "../../Functions";
import { BaseHub } from "./BaseHub";
import { HubEvents, Hubs, HubsTeam, ItemChild, ItemParent, ItemsTeam, Items } from '../Types';
import { ItemTeam } from "../Items/BaseItemTeam";
import { Select } from './SignalRHub';

export class BaseHubTeam<T extends ItemsTeam> {
	Parent: HubsTeam;
	Teams: ItemTeam<T>[] = [];
	NewSelect?: HTMLSelectElement;

	constructor(parent: HubsTeam, funcCallBack: TypedEventEmitter<HubEvents>) {
		this.Parent = parent;
		funcCallBack.On("teamCreate", ({ team }) => {
			let _team = new ItemTeam<T>(team.ID, team.Name, parent.Items as T[]);
			this.Teams.push(_team);
			if (this.NewSelect) {
				this.NewSelect.add(_team.CreateOption().Option);
			}
		});
		funcCallBack.On("teamUpdate", ({ team }) => {
			let Team = this.Teams.find((t) => t.ID == team.ID);
			if (!Team) return;
			Team.Name = team.Name;
			for (const option of Team.Options) option.textContent = team.Name;
		});
		funcCallBack.On("teamDeleted", ({ id }) => {
			let team = this.Teams.find((t) => t.ID == id);
			if (!team) return;
			for (const option of team.Options) option.remove();
			this.Teams.filter((t) => t.ID != id);
		});
	}

	protected ExtendAdd = (parent: ItemsTeam) => {
		for (const team of this.Teams) {
			this.Parent.AddOption(parent, team as ItemChild<T>, parent.ItemTeams.Select.ItemID, parent.ItemTeams.Select.Element, parent.ItemTeams.Select.Options);
		}
	};

	protected ExtendServerUpdateAfter = (item: T, teamID: number | undefined) => {
		// if (teamID == 0) item.ItemTeams.Select.Element.selectedIndex = 0;
		// else if (teamID)
		// 	for (const option of this.Teams.find((t) => t.ID == teamID)!.Options)
		// 		Array.from(item.ItemTeams.Select.Options)
		// 			.find((o) => o.Option == option)
		// 			?.SetSelect();
	};
}
