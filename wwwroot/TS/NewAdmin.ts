import { AdminMemberHub } from "./Models/New/Hubs/Member/AdminMemberHub";
import { AdminTeamHub } from "./Models/New/Hubs/Team/AdminTeamHub";
import { AdminTrainerHub } from "./Models/New/Hubs/Trainer/AdminTrainerHub";
import { AdminHubs } from "./Models/New/Types";

function initializeHub<T extends AdminHubs>(wrapperId: string, HubClass: new (wrapper: HTMLElement) => T) {
	const wrapper = document.getElementById(wrapperId);
	if (!wrapper) throw new Error(`Element with id ${wrapperId} not found`);

	const tmpHub = new HubClass(wrapper);
}

initializeHub("MembersCard", AdminMemberHub);
initializeHub("TeamsCard", AdminTeamHub);
initializeHub("TrainersCard", AdminTrainerHub);