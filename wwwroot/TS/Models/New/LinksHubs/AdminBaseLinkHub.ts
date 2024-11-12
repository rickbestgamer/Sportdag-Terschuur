import { AdminItems } from "../Types";
import { AdminSignalRHub } from './AdminSignalRHub';
import { BaseLinkHub } from "./BaseLinkHub";
export abstract class AdminBaseLinkHub<T extends AdminItems> extends BaseLinkHub<T, AdminSignalRHub<T>> {
	constructor(hubName: string) {
		super(hubName);
	}

	protected CreateHub(hubName: string): AdminSignalRHub<T> {
		return new AdminSignalRHub<T>(hubName);
	}
}
