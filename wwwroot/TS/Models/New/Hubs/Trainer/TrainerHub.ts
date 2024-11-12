import { Trainer } from "../../Items/Trainer/Trainer";
import { ServerTrainer } from "../../Types";
import { BaseHub } from "../BaseHub";

export class TrainerHub extends BaseHub<Trainer> {

	constructor(wrapper: HTMLElement) {
		super(wrapper);
	}

	protected ConstructItem = (card: ServerTrainer): Trainer => {
		return new Trainer(card);
	};

	protected ExtendServerUpdate = (item: Trainer, name: string, role: number, teamID: number | undefined) => {
		item.Name = name;
	};

	protected ExtendServerDelete = (item: Trainer): void => {
		item.Remove();
		this.Items.filter((t) => t !== item);
	};
}
