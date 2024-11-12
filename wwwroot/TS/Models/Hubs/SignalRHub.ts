import * as signalR from "@microsoft/signalr";
import { AdminCreateTypes, AdminDeleteTypes, AdminItems, AdminUpdateTypes, Items, ServerUpdateBase } from "../../Models/Types";

export class BaseSignalRHub<T extends Items> {
	protected Connection: signalR.HubConnection;
	constructor(name: string, serverUpdate: (...arg: ServerUpdateBase<T>) => void, serverDelete: (...arg: any[]) => void, serverAdd: (...arg: any[]) => void, altConnection?: signalR.HubConnection) {
		const connection = altConnection ? altConnection : new signalR.HubConnectionBuilder().withUrl(`/${name}`).configureLogging(signalR.LogLevel.None).build();

		connection.start().then(() => {
			connection.invoke("Connect");
		});

		connection.onreconnecting((error) => {
			console.warn(`Connection lost due to error "${error}". Reconnecting...`);
		});

		connection.onreconnected((connectionId) => {
			console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
		});

		connection.onclose((error) => {
			console.error(`Connection closed due to error "${error}". Attempting to restart connection...`);

			this.startConnection(this.Connection);
		});

		window.addEventListener("beforeunload", () => {
			connection.stop().catch((err) => console.error(err.toString()));
		});

		connection.on("ServerUpdate", serverUpdate);
		connection.on("ServerDelete", serverDelete);
		connection.on("ServerAdd", serverAdd);
		this.Connection = connection;
	}

	Update = (...arg: AdminUpdateTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Update", ...arg);
	};

	private startConnection = (Connection: signalR.HubConnection) => {
		Connection.start()
			.then(() => {
				Connection.invoke("Connect");
			})
			.catch((err) => {
				console.error("SignalR connection error: ", err);

				setTimeout(() => this.startConnection(Connection), 5000);
			});
	};
}

export class AdminSignalRHub<T extends AdminItems> extends BaseSignalRHub<T> {
	protected Connection: signalR.HubConnection;

	constructor(name: string, serverUpdate: (...arg: ServerUpdateBase<T>) => void, serverDelete: (...arg: any[]) => void, serverAdd: (...arg: any[]) => void) {
		const connection = new signalR.HubConnectionBuilder().withUrl(`/${name}`).configureLogging(signalR.LogLevel.None).build();

		super(name, serverUpdate, serverDelete, serverAdd, connection);

		this.Connection = connection;
	}

	Create = (...arg: AdminCreateTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Create", ...arg);
	};

	Delete = (...arg: AdminDeleteTypes<T>): Promise<unknown> => {
		return this.Connection.invoke("Delete", ...arg);
	};
}
