import { ListWrapper } from "../../../GeneralItems";
import { BaseElement } from "../BaseElement";

export abstract class BaseTeamCard<E extends ListWrapper<any> = ListWrapper<any> > extends BaseElement {
	NameSpan = document.createElement("h2");
	NameWrapper = document.createElement("div");
	abstract TrainerWrapper: E;
	abstract MemberWrapper: E;

	constructor() {
		super();
		this.NameWrapper.append(this.NameSpan);
	}
}
