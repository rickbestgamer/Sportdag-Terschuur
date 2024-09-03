import { GetAttributeId, TypedEventEmitter } from "./Functions";
import { MemberHub } from "./Models/Hubs/MemberHub";
import { TeamHub } from "./Models/Hubs/TeamHub";
import { TrainerHub } from "./Models/Hubs/TrainerHub";
import { HubEvents, Hubs } from "./Models/Types";

const callback = new TypedEventEmitter<HubEvents>();

const memberHub = initializeHub("MembersCard", "form#NewMember", "MemberCard", MemberHub);
const teamHub = initializeHub("TeamsCard", "form#NewTeam", "TeamCard", TeamHub);
const trainerHub = initializeHub("TrainersCard", "form#NewTrainer", "TrainerCard", TrainerHub);

function initializeHub<T extends Hubs>(wrapperId: string, formSelector: string, itemName: string, HubClass: new (wrapper: HTMLElement, funcCallBack: TypedEventEmitter<HubEvents>, newForm?: HTMLFormElement) => T): T {
	const wrapper = document.getElementById(wrapperId);
	if (!wrapper) throw new Error(`Element with id ${wrapperId} not found`);

	const form = wrapper.querySelector<HTMLFormElement>(formSelector) ?? undefined;
	if (!form) new Error(`Element with ${formSelector} not found`);

	const tmpHub = new HubClass(wrapper, callback, form);
	processElements(wrapper.getElementsByClassName(itemName) as HTMLCollectionOf<HTMLElement>, tmpHub.NewItem);

	return tmpHub;
}

function processElements(elements: HTMLCollectionOf<HTMLElement>, callback: (el: HTMLElement) => any) {
	Array.from(elements).forEach(callback);
}
