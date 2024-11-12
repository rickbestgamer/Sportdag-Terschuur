import { AdminMemberHub } from "./Models/Hubs/MemberHub";
import { AdminTeamHub } from "./Models/Hubs/TeamHub";
import { AdminTrainerHub } from "./Models/Hubs/TrainerHub";
import { AdminHubs } from "./Models/Types";

function initializeHub<T extends AdminHubs>(wrapperId: string, formSelector: string, itemName: string, HubClass: new (wrapper: HTMLElement, newForm?: HTMLFormElement) => T): T {
	const wrapper = document.getElementById(wrapperId);
	if (!wrapper) throw new Error(`Element with id ${wrapperId} not found`);

	const form = wrapper.querySelector<HTMLFormElement>(formSelector) ?? undefined;
	if (!form) new Error(`Element with ${formSelector} not found`);

	const tmpHub = new HubClass(wrapper, form);
	processElements(wrapper.getElementsByClassName(itemName) as HTMLCollectionOf<HTMLElement>, tmpHub.CreateItem);

	return tmpHub;
}

function processElements(elements: HTMLCollectionOf<HTMLElement>, callback: (el: HTMLElement) => any) {
	Array.from(elements).forEach((el) => {
		callback(el);
	});
}

initializeHub("MembersCard", "form#NewMember", "MemberCard", AdminMemberHub);
initializeHub("TeamsCard", "form#NewTeam", "TeamCard", AdminTeamHub);
initializeHub("TrainersCard", "form#NewTrainer", "TrainerCard", AdminTrainerHub);
