export abstract class BaseItem {
	readonly ID: number;

	constructor(id: number) {
		this.ID = id;
	}

	abstract Remove: () => void;
}
