//#region Imports
import * as signalR from "@microsoft/signalr";
import { AdminCreateTypes, AdminDeleteTypes, AdminItems, AdminUpdateTypes } from "../Types";
import { BaseSignalRHub } from "./BaseSignalRHub";
//#endregion

export class AdminSignalRHub<T extends AdminItems> extends BaseSignalRHub<T> {
	protected Connection: signalR.HubConnection;

	constructor(name: string) {
		const connection = new signalR.HubConnectionBuilder().withUrl(`/${name}`).withAutomaticReconnect().configureLogging(signalR.LogLevel.None).build();

		super(name, connection);

		this.Connection = connection;
	}

	//#region Invoke server

	Create = (...arg: AdminCreateTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Create", ...arg);
	};

	Update = (...arg: AdminUpdateTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Update", ...arg);
	};

	Delete = (...arg: AdminDeleteTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Delete", ...arg);
	};

	//#endregion
}
