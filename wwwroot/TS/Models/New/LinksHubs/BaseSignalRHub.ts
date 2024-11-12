//#region Imports
import * as signalR from "@microsoft/signalr";
import { BaseItems, Items, ServerCreateBase, ServerDeleteBase, ServerReviewBase, ServerUpdateBase } from "../Types";
//#endregion

export class BaseSignalRHub<T extends Items> {
	//#region Props

	protected Connection: signalR.HubConnection;
	Ready: boolean = false;
	ServerCreate?: (arg: ServerCreateBase<T>) => void;
	_ServerReview?: (arg: ServerReviewBase<T>) => void;
	ServerUpdate?: (arg: ServerUpdateBase<T>) => void;
	ServerDelete?: (arg: ServerDeleteBase<T>) => void;

	//#endregion

	constructor(name: string, altConnection?: signalR.HubConnection) {
		const connection = altConnection ? altConnection : new signalR.HubConnectionBuilder().withUrl(`/${name}`).withAutomaticReconnect().configureLogging(signalR.LogLevel.None).build();

		//#region Connection handlers

		connection.start().then(() => {
			connection.invoke("Connect");
			this.Ready = true;
			this.Review();
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

		//#endregion

		this.Connection = connection;

		//#region Server responses

		connection.on("Create", (arg: ServerCreateBase<T>) => {
			this.ServerCreate?.(arg);
		});
		connection.on("Review", (arg: ServerReviewBase<T>) => {
			this._ServerReview?.(arg);
		});
		connection.on("Update", (arg: ServerUpdateBase<T>) => {
			this.ServerUpdate?.(arg);
		});
		connection.on("Delete", (arg: ServerDeleteBase<T>) => {
			this.ServerDelete?.(arg);
		});

		//#endregion
	}

	private startConnection = async (connection: signalR.HubConnection) => {
		try {
			connection.start().then(() => {
				connection.invoke("Connect");
			});
		} catch (err) {
			console.error("SignalR connection error: ", err);
			setTimeout(() => this.startConnection(this.Connection), 5000);
		}

		while (true) {
			// Infinite loop for continuous retry
			try {
				await connection.start();
				console.log("Reconnected successfully!");
				break; // Exit loop when reconnected
			} catch (err) {
				console.log("Reconnect attempt failed. Retrying in 5 seconds...", err);
				await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
			}
		}
	};

	private Review = () => {
		this.Connection.invoke("Review");
	};

	get ServerReview(): ((arg: ServerReviewBase<T>) => void) | undefined {
		return this._ServerReview;
	}

	set ServerReview(func: ((arg: ServerReviewBase<T>) => void) | undefined) {
		this._ServerReview = func;
		if (this.Ready) this.Review();
	}
}
