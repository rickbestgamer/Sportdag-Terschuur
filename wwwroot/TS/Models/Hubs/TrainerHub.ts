import { Select } from "../GeneralItems";
import { AdminTrainer, Trainer } from "../Items/Trainer";
import { HubFactory } from "../Links/Hubs/HubFactory";
import { AdminTrainerLinkHub } from "../Links/Hubs/TrainerLinkHub";
import { AdminBaseHub } from "./AdminBaseHub";
import { BaseHub } from "./BaseHub";

export class AdminTrainerHub extends AdminBaseHub<AdminTrainer> {
	private LinkHub: AdminTrainerLinkHub;
	private TeamSelect: Select = new Select();

	constructor(wrapper: HTMLElement, trainerForm?: HTMLFormElement) {
		super(wrapper, "TrainerHub", trainerForm);

		if (trainerForm) this.HandleFormSubmission(trainerForm);

		this.LinkHub = HubFactory.GetInstance(AdminTrainerLinkHub);
	}

	protected ConstructItem = (card: HTMLElement): AdminTrainer => {
		const trainer = new AdminTrainer(card, this.Update, this.Delete);

		this.LinkHub.CreateTrainer(trainer);

		return trainer;
	};

	protected ExtendServerUpdate = (item: AdminTrainer, name: string, role: number, teamID: number | undefined) => {
		item.Data.Name = name;
		item.Role.checked = role == 0;
		if (item.TeamSelect) item.TeamSelect.ID = teamID ?? 0;

		this.LinkHub.UpdateTrainer(item);
	};

	protected ExtendServerDelete = (item: AdminTrainer): void => {
		item.Card.remove();

		this.Items = this.Items.filter((t) => t !== item);

		this.LinkHub.DeleteTrainer(item);
	};

	private HandleFormSubmission = (form: HTMLFormElement) => {
		const name = form.querySelector("input#NewTrainerName") as HTMLInputElement | null;
		const role = form.querySelector("input#NewRole") as HTMLInputElement | null;
		const teamWrapper = form.querySelector(".TeamWrapper") as HTMLElement | null;

		if (!name) return console.error("Input field for name for creating trainers was not found");
		if (!role) return console.error("Checkbox for creating trainers was not found");
		if (!teamWrapper) console.warn("There was no wrapper found to add the select that links the new trainer to a team");

		teamWrapper?.appendChild(this.TeamSelect.Element);

		form.addEventListener("submit", async (e: SubmitEvent) => {
			e.preventDefault();

			const trimmedName = name.value.trim();

			if (name.value === "" || this.IsDuplicateTrainer(trimmedName)) return;

			await this.ExecuteCreate(async () => await this.Hub.Create(trimmedName, role.checked ? 0 : 1, this.TeamSelect.ID));

			form.reset();
			this.TeamSelect.ID = 0;
		});
	};

	private IsDuplicateTrainer = (name: string) => {
		return this.Items.some((i) => i.Data.Name.trim().toLowerCase() === name.toLowerCase());
	};

	private Update = async (trainer: AdminTrainer): Promise<unknown> => {
		return await this.Hub.Update(trainer.ID, trainer.Data.Name, trainer.Role.checked ? 0 : 1, trainer.TeamSelect?.ID);
	};

	private Delete = async (trainer: Trainer): Promise<unknown> => {
		return await this.Hub.Delete(trainer.ID);
	};
}

export class TrainerHub extends BaseHub<Trainer> {
	constructor(wrapper: HTMLElement) {
		super(wrapper, "TrainerHub");
	}

	protected ConstructItem = (card: HTMLElement): Trainer => {
		return new Trainer(card);
	};

	protected ExtendServerUpdate = (item: Trainer, name: string, role: number, teamID: number | undefined) => {
		item.Data.Name = name;
	};

	protected ExtendServerDelete = (item: Trainer): void => {
		item.Card.remove();
		this.Items = this.Items.filter((t) => t !== item);
	};
}
