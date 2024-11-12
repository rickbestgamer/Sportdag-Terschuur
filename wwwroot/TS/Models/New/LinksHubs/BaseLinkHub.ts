import { Items, ServerCreateBase, ServerDeleteBase, ServerItem, ServerReviewBase, ServerUpdateBase } from "../Types";
import { BaseSignalRHub } from "./BaseSignalRHub";
import { ItemCollection } from "./ItemCollection";

export abstract class BaseLinkHub<T extends Items, H extends BaseSignalRHub<T> = BaseSignalRHub<T>> {
	protected Hub: H;
	protected IC = new ItemCollection<ServerItem<T>>();
	protected CreateCB = new Set<(item: ServerCreateBase<T>) => void>();
	protected UpdateCB = new Set<(item: ServerUpdateBase<T>) => void>();
	protected DeleteCB = new Set<(item: ServerDeleteBase<T>) => void>();

	constructor(hubName: string) {
		this.Hub = this.CreateHub(hubName);
		this.Hub.ServerCreate = this.ServerCreate;
		this.Hub.ServerUpdate = this.ServerUpdate;
		this.Hub.ServerDelete = this.ServerDelete;
	}

	protected CreateHub(hubName: string): H {
		return new BaseSignalRHub<T>(hubName) as H;
	}

	//#region Server responses

	protected ServerCreate = (item: ServerCreateBase<T>) => {
		for (const cb of this.CreateCB) cb(item);
	};

	get ServerReview(): ((arg: ServerReviewBase<T>) => void) | undefined {
		return this.Hub.ServerReview;
	}

	set ServerReview(func: ((arg: ServerReviewBase<T>) => void) | undefined) {
		this.Hub.ServerReview = func;
	}

	protected ServerUpdate = (args: ServerUpdateBase<T>) => {
		for (const cb of this.UpdateCB) cb(args);
	};

	protected ServerDelete = (args: ServerDeleteBase<T>) => {
		for (const cb of this.DeleteCB) cb(args);
		this.IC.Delete(args);
	};

	//#endregion

	//#region Register events

	OnCreate = (CB: (linkItem: ServerCreateBase<T>) => void) => {
		this.CreateCB.add(CB);
		this.IC.All(CB);
	};

	OnUpdate = (CB: (linkItem: ServerUpdateBase<T>) => void) => {
		this.UpdateCB.add(CB);
	};

	OnDelete = (CB: (linkItem: ServerDeleteBase<T>) => void) => {
		this.DeleteCB.add(CB);
	};

	//#endregion
}
