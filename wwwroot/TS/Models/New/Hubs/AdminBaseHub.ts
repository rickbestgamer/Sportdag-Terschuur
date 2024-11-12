import { BaseHub } from "../Hubs/BaseHub";
import { AdminItems } from "../Types";

export abstract class AdminBaseHub<T extends AdminItems> extends BaseHub<T> {

	constructor(wrapper: HTMLElement, newForm?: HTMLFormElement) {
		super(wrapper);
	}
}
