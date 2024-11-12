import { BaseElement } from "../BaseElement";

export class BaseMemberCard extends BaseElement {
	NameSpan = document.createElement("h2");
	NameWrapper = document.createElement("div");
	private Present = document.createElement("input");
	private PresentLabel = document.createElement("span");
	PresentWrapper = document.createElement("div");
	private TeamLabel = document.createElement("h4");
	TeamWrapper = document.createElement("div");

	constructor() {
		super();
		this.NameWrapper.append(this.NameSpan);
		this.Present.type = "checkbox";
		this.Present.disabled = true;
		this.PresentLabel.textContent = "Present";
		this.PresentWrapper.append(this.PresentLabel, this.Present);
		this.TeamLabel.textContent = "Team";
		this.TeamWrapper.append(this.TeamLabel);
	}

	get PresentCheck(): boolean {
		return this.Present.checked;
	}

	set PresentCheck(bool: boolean) {
		this.Present.checked = bool;
	}

	set PresentDis(bool: boolean) {
		this.Present.disabled = bool;
	}

	set PresentUpdate(func:()=>void) {
		this.Present.onchange = func
	}
}
