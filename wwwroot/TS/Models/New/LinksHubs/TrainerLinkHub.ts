import { AdminDeleteTypes, AdminUpdateTypes, ServerTrainer } from "../Types";
import { AdminBaseLinkHub } from "./AdminBaseLinkHub";
import { AdminTrainer } from "../Items/Trainer/AdminTrainer";

export class AdminTrainerLinkHub extends AdminBaseLinkHub<AdminTrainer> {
	constructor() {
		super("TrainerHub");
		this.ServerReview = this.ReviewTrainer;
	}

	CreateTrainer = (name:string, role:boolean, teamID:number) => {
		return this.Hub.Create(name, role, teamID);
	};

	ReviewTrainer = (trainers: ServerTrainer[]) => {
		for (const trainer of trainers) {
			for (const cb of this.CreateCB) cb(trainer);
			this.IC.Add(trainer);
		}
	};

	UpdateTrainer = (...arg: AdminUpdateTypes<AdminTrainer>) => {
		return this.Hub.Update(...arg);
	};

	DeleteTrainer = (...arg: AdminDeleteTypes<AdminTrainer>) => {
		return this.Hub.Delete(...arg);
	};
}

// export class TrainerLinkHub extends BaseLinkHub<Trainer> {}
