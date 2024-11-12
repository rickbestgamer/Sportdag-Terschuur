// import { ItemTeam } from "../Models/Items/Team";
// import { Member } from "./Items/Member";
// import { Team } from "./Items/Team";
// import { Trainer } from "./Items/Trainer";
// import { ItemMember } from "./Items/BaseItemMember";
// import { ItemTrainer } from "./Items/BaseItemTrainer";
// import { TeamHub } from "./Hubs/TeamHub";
// import { MemberHub } from "./Hubs/MemberHub";
// import { TrainerHub } from "./Hubs/TrainerHub";
// import { AdminSignalRHub, BaseSignalRHub } from "./Hubs/SignalRHub";

import { AdminMemberHub, MemberHub } from "./Hubs/MemberHub";
import { BaseSignalRHub, AdminSignalRHub } from "./Hubs/SignalRHub";
import { AdminTeamHub, TeamHub } from "./Hubs/TeamHub";
import { AdminTrainerHub, TrainerHub } from "./Hubs/TrainerHub";
import { AdminMember, Member } from "./Items/Member";
import { AdminTeam, Team } from "./Items/Team";
import { AdminTrainer, Trainer } from "./Items/Trainer";
// import { AdminItems } from "../new/Types";

// export type LinkHubs<T extends Items> = T extends Member?
export type SignalRHubs<T extends AdminItems> = BaseSignalRHub<T> | AdminSignalRHub<T>;
export type ItemsTeam = Member | Trainer;
export type ItemsMember = Team;
export type ItemsTrainer = Team;
// export type Items = Team | Member | Trainer;
export type LinkItems<T> = T extends Team ? Team : T extends Member ? Member : T extends Trainer ? Trainer : never;
export type HubsTeam = MemberHub | TrainerHub;
export type Hubs = TeamHub | MemberHub | TrainerHub;
export type ItemTypes<T extends Items> = T extends Member ? [id: number, Present: boolean, FirstName: string, LastName: string, teamID: number | undefined] : T extends Trainer ? [id: number, Name: string, Role: number, teamID: number | undefined] : T extends Team ? [id: number, Name: string] : never;
export type ItemsConstructor<T extends Items> = T extends Team ? new (card: HTMLElement, update: (arg: T) => Promise<unknown>, Delete: (arg: T) => Promise<unknown>) => T : T extends Trainer | Member ? new (card: HTMLElement, update: (arg: T) => Promise<unknown>, Delete: (arg: T) => Promise<unknown>, teams: Team[]) => T : never;
export type ItemParent = ItemsTeam | ItemsTrainer | ItemsMember;
// export type ItemChild<T extends ItemParent> = T extends ItemsTeam ? ItemTeam<T> : T extends ItemsMember ? ItemMember<T> : T extends ItemsTrainer ? ItemTrainer<T> : never;
export type FormElement = HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement;
export type Update<T extends Items> = T extends Member ? (memberID: number, present: boolean, firstName: string, lastName: string, teamID?: number) => void : T extends Trainer ? (id: number, name: string, role: number, teamID?: number) => void : T extends Team ? (id: number, name: string) => void : never;
export type EmitEvents = "create" | "update" | "delete";
export type HubEvents = {
	teamCreate: { team: Team };
	teamUpdate: { team: Team };
	teamDeleted: { id: number };
	trainerCreate: { trainer: Trainer };
	trainerUpdate: { trainer: Trainer };
	trainerDeleted: { id: number };
	memberCreate: { member: Member };
	memberUpdate: { member: Member };
	memberDelete: { id: number };
};
export type ApiResponse = {
	result: string;
	id: number;
	exception: any;
	status: number;
	isCanceled: boolean;
	isCompleted: boolean;
	isCompletedSuccessfully: boolean;
	creationOptions: number;
	asyncState: any;
	isFaulted: boolean;
};

export type AdminHubs = AdminMemberHub | AdminTeamHub | AdminTrainerHub;

export type AdminItems = AdminMember | AdminTeam | AdminTrainer;
export type Items = Member | Team | Trainer;
export type AdminCreateTypes<T> = T extends AdminMember ? [firstName: string, lastName: string, teamID: number | undefined] : T extends AdminTrainer ? [name: string, role: number, teamID: number] : T extends AdminTeam ? [name: string] : never;
export type AdminUpdateTypes<T> = T extends Member | AdminMember ? [id: number, present: boolean, firstName: string, lastName: string, teamID?: number] : T extends Trainer | AdminTrainer ? [id: number, name: string, role: number, teamID?: number] : T extends Team | AdminTeam ? [id: number, name: string] : never;
export type AdminDeleteTypes<T> = T extends Member | AdminMember | Team | AdminTeam | Trainer | AdminTrainer ? [id: number] : never;
export type ServerUpdateBase<T> = T extends Member | AdminMember ? [id: number, present: boolean, firstName: string, lastName: string, teamID: number | undefined] : T extends Trainer | AdminTrainer ? [id: number, name: string, role: number, teamID: number | undefined] : T extends Team | AdminTeam ? [id: number, name: string] : never;
export type ServerUpdate<T> = T extends Member | AdminMember ? [present: boolean, firstName: string, lastName: string, teamID: number | undefined] : T extends Trainer | AdminTrainer ? [name: string, role: number, teamID: number | undefined] : T extends Team | AdminTeam ? [name: string] : never;
