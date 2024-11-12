export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type CallBack<t> = (payload: t) => void;

export class TypedEventEmitter<EventPayloads extends Record<string, any>> {
	private Events = new Map<keyof EventPayloads, CallBack<any>[]>();

	On = <k extends keyof EventPayloads>(event: k, callback: (payload: EventPayloads[k]) => void) => {
		if (!this.Events.has(event)) {
			this.Events.set(event, []);
		}
		this.Events.get(event)!.push(callback);
	};

	Off = <k extends keyof EventPayloads>(event: k, callback: (payload: EventPayloads[k]) => void) => {
		if (this.Events.has(event)) {
			this.Events.set(
				event,
				this.Events.get(event)!.filter((cb) => cb !== callback)
			);
		}
	};

	Emit = <k extends keyof EventPayloads>(event: k, payload: EventPayloads[k]) => {
		this.Events.get(event)?.forEach((cb) => cb(payload));
	};
}

export function GetAttributeId(el: HTMLElement | HTMLElement[] | HTMLCollectionOf<HTMLElement>, attributeName: string): Set<number> {
	el = el instanceof HTMLElement ? [el] : Array.from(el);
	let ids: Set<number> = new Set();

	for (const element of el) {
		const idsAttribute = element.getAttribute(attributeName);
		element.removeAttribute(attributeName);
		const IDS: number[] = idsAttribute?.startsWith("[") ? JSON.parse(idsAttribute) : idsAttribute ? [Number(idsAttribute)] : [];
		IDS.forEach((id) => ids.add(id));
	}
	return ids;
}

export function StringToElement(string: string): HTMLElement {
	let tempParent = document.createElement("div");
	tempParent.innerHTML = string.trim();
	return tempParent.firstChild as HTMLElement;
}

export function StringToElements(string: string): HTMLCollection {
	let tempParent = document.createElement("div");
	tempParent.innerHTML = string.trim();
	return tempParent.children;
}
