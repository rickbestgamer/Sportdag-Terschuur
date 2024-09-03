export class BaseItem {
	readonly Card: HTMLElement;
	readonly ID: number;
	constructor(card: HTMLElement) {
		this.Card = card;
		this.ID = parseInt(card.getAttribute("ID")!);
		this.Card.removeAttribute("ID");
	}
}
