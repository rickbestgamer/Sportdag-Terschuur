import * as signalR from "@microsoft/signalr";
import { Items, ItemTypes } from "../Types";
import { stringify } from "querystring";
import { setDefaultAutoSelectFamily } from "net";

export class Option {
	ID: number;
	Option: HTMLOptionElement;

	constructor(id: number, text: string) {
		let option = document.createElement("option");
		this.ID = id;
		this.Option = option;
		option.textContent = text;
	}

	SetSelect = () => {
		this.Option.selected = true;
	};
}

export class SelectWrapper {
	Wrapper: HTMLElement;
	Selects: Select[] = [];
	constructor(wrapper: HTMLElement) {
		this.Wrapper = wrapper;
	}
	AddSelect = (options: SelectOptions): Select => {
		const select = new Select(options);
		this.Selects.push(select);
		return select;
	};
}

interface SelectOptions {
	Null?: boolean;
	Id?: number;
	Update?: (select: Select) => any;
}

export class Select {
	Element = document.createElement("select");
	Options: Option[] = [];
	ItemID: number = 0;
	SelectedOption: string;
	constructor(options: SelectOptions = { Null: true }) {
		if (options.Update) {
			this.Element.addEventListener("change", (e) => {
				console.log("update");
				const option = this.Element.value;
				const selectOption = this.Element.options[this.Element.selectedIndex];
				this.ItemID = this.Options.find((o) => o.Option == selectOption) ? this.Options.find((o) => o.Option == selectOption)!.ID : 0;
				this.Element.value = this.SelectedOption;
				this.SelectedOption = option;
				options.Update?.(this);
			});
		}
		options.Null = options.Null !== undefined ? options.Null : true;
		if (options.Null) this.CreateOption(0, "");
		if (options.Id) this.ItemID = options.Id;
		this.SelectedOption = this.Element.value;
	}

	CreateOption = (id: number, text: string) => {
		const option = new Option(id, text);
		option.Option.selected = this.ItemID == option.ID ? true : false;
		this.Options.push(option);
		this.Element.add(option.Option);
	};
}

export class BaseSignalRHub<T extends Items> {
	constructor(name: string, serverUpdate: (...arg: ItemTypes<T>) => void, serverDelete: (...arg: any[]) => void, serverAdd: (...arg: any[]) => void, connection?: signalR.HubConnection) {
		const Connection = connection ? connection : new signalR.HubConnectionBuilder().withUrl(`/${name}`).configureLogging(signalR.LogLevel.None).build();
		Connection.start().then(() => {
			Connection.invoke("Connect");
		});

		Connection.onreconnecting((error) => {
			console.warn(`Connection lost due to error "${error}". Reconnecting...`);
		});

		Connection.onreconnected((connectionId) => {
			console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
		});

		Connection.onclose((error) => {
			console.error(`Connection closed due to error "${error}". Attempting to restart connection...`);
			this.startConnection(Connection);
		});

		window.addEventListener("beforeunload", () => {
			Connection.stop().catch((err) => console.error(err.toString()));
		});

		Connection.on("ServerUpdate", serverUpdate);
		Connection.on("ServerDelete", serverDelete);
		Connection.on("ServerAdd", serverAdd);
	}

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

export class AdminSignalRHub<T extends Items> extends BaseSignalRHub<T> {
	protected Connection: signalR.HubConnection;
	constructor(name: string, serverUpdate: (...arg: ItemTypes<T>) => void, serverDelete: (...arg: any[]) => void, serverAdd: (...arg: any[]) => void) {
		const connection = new signalR.HubConnectionBuilder().withUrl(`/${name}`).configureLogging(signalR.LogLevel.None).build();
		super(name, serverUpdate, serverDelete, serverAdd, connection);
		this.Connection = connection;
	}

	Create = (...arg: any[]): Promise<unknown> => {
		return this.Connection.invoke("Create", ...arg);
	};

	Update = (...arg: any[]): Promise<unknown> => {
		return this.Connection.invoke("Update", ...arg);
	};

	Delete = (...arg: any[]): Promise<unknown> => {
		return this.Connection.invoke("Delete", ...arg);
	};
}
