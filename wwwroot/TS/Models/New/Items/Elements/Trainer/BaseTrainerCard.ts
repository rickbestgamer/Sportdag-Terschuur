import { BaseElement } from "../BaseElement";

export class BaseTrainerCard extends BaseElement {
	NameSpan = document.createElement("h2");
	NameWrapper = document.createElement("div");
	private Role = document.createElement("input");
	private RoleLabel = document.createElement("span");
	RoleWrapper = document.createElement("div");
	private TeamLabel = document.createElement("h4");
	TeamWrapper = document.createElement("div");

	constructor() {
		super();
		this.NameWrapper.append(this.NameSpan);
		this.Role.type = "checkbox";
		this.Role.disabled = true;
		this.RoleLabel.textContent = "Admin";
		this.RoleWrapper.append(this.RoleLabel, this.Role);
		this.TeamLabel.textContent = "Team";
		this.TeamWrapper.append(this.TeamLabel);
	}

	get RoleCheck(): boolean {
		return this.Role.checked;
	}

	set RoleCheck(bool: boolean) {
		this.Role.checked = !bool;
	}

	set RoleDis(bool: boolean) {
		this.Role.disabled = bool;
	}
}
