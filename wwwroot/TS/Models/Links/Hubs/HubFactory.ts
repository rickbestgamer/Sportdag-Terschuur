import { BaseLinkHub } from "./BaseLinkHub";

export class HubFactory {
	private static Hubs: Map<string, BaseLinkHub<any>> = new Map();

	static GetInstance<U extends BaseLinkHub<any>>(type: new () => U): U {
		const typeName = type.name;

		if (!HubFactory.Hubs.has(typeName)) {
			HubFactory.Hubs.set(typeName, new type());
		}

		return HubFactory.Hubs.get(typeName) as U;
	}
}
