import { GetAttributeId } from "../../Functions";

export abstract class BaseItem {
	readonly Card: HTMLElement;
	readonly ID: number;

	constructor(card: HTMLElement) {
		this.Card = card;
		this.ID = GetAttributeId(card, "ID").values().next().value ?? 0;
	}
}
