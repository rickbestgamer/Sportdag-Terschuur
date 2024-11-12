
export class HubFactory {
	private static Hubs: Map<string, any> = new Map();

	static GetInstance<U>(type: new () => U): U {
		const typeName = type.name;

		if (!HubFactory.Hubs.has(typeName)) {
			HubFactory.Hubs.set(typeName, new type());
		}

		return HubFactory.Hubs.get(typeName) as U;
	}
}
