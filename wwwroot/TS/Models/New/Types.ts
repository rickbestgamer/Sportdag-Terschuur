//#region Imports
import { AdminMemberHub } from "./Hubs/Member/AdminMemberHub";
import { AdminTeamHub } from "./Hubs/Team/AdminTeamHub";
import { AdminTrainerHub } from "./Hubs/Trainer/AdminTrainerHub";
import { AdminMemberCard } from "./Items/Elements/Member/AdminMemberCard";
import { MemberCard } from "./Items/Elements/Member/MemberCard";
import { AdminTeamCard } from "./Items/Elements/Team/AdminTeamCard";
import { TeamCard } from "./Items/Elements/Team/TeamCard";
import { AdminTrainerCard } from "./Items/Elements/Trainer/AdminTrainerCard";
import { TrainerCard } from "./Items/Elements/Trainer/TrainerCard";
import { AdminMember } from "./Items/Member/AdminMember";
import { Member } from "./Items/Member/Member";
import { AdminTeam } from "./Items/Team/AdminTeam";
import { Team } from "./Items/Team/Team";
import { AdminTrainer } from "./Items/Trainer/AdminTrainer";
import { Trainer } from "./Items/Trainer/Trainer";
//#endregion

export type AdminHubs = AdminMemberHub | AdminTeamHub | AdminTrainerHub;

export type AdminItems = AdminMember | AdminTeam | AdminTrainer;
export type BaseItems = Member | Team | Trainer;
export type Items = Member | Team | Trainer | AdminItems;

export type FormElement = HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement;
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

export type AdminCreateTypes<T> = T extends AdminMember ? [firstName: string, lastName: string, teamID: number | undefined] : T extends AdminTrainer ? [name: string, role: boolean, teamID: number] : T extends AdminTeam ? [name: string] : never;
export type AdminUpdateTypes<T> = T extends Member | AdminMember ? [id: number, present: boolean, firstName: string, lastName: string, teamID?: number] : T extends Trainer | AdminTrainer ? [id: number, name: string, role: boolean, teamID?: number] : T extends Team | AdminTeam ? [id: number, name: string, memberIDS: number[], trainerIDS: number[]] : never;
export type AdminDeleteTypes<T> = T extends Member | AdminMember | Team | AdminTeam | Trainer | AdminTrainer ? [id: number] : never;

export type ServerCreateBase<T> = ServerItem<T>;
export type ServerReviewBase<T> = T extends Member ? ServerMember[] : T extends Team ? ServerTeam[] : T extends Trainer ? ServerTrainer[] : never;
export type ServerUpdateBase<T> = ServerItem<T>;
export type ServerDeleteBase<T> = ServerItem<T>;

export type ServerUpdate<T> = T extends Member | AdminMember ? [present: boolean, firstName: string, lastName: string, teamID: number | undefined] : T extends Trainer | AdminTrainer ? [name: string, role: number, teamID: number | undefined] : T extends Team | AdminTeam ? [name: string] : never;

export type ServerItem<T> = T extends Member | AdminMember ? ServerMember : T extends Team | AdminTeam ? ServerTeam : T extends Trainer | AdminTrainer ? ServerTrainer : never;
export type ServerMember = {
	id: number;
	firstName: string;
	lastName: string;
	present: boolean;
	sdTeam_ID?: number;
	sdTeam_Name?: string;
};

export type ServerTeam = {
	id: number;
	name: string;
	sdUsers: TeamUser[];
	sdTeamMembers: TeamMember[];
};

export type TeamUser = {
	id: number;
	name: string;
};

export type TeamMember = {
	id: number;
	firstName: string;
	lastName: string;
};

export type ServerTrainer = {
	id: number;
	name: string;
	role: boolean;
	sdTeam_ID: number | undefined;
	sdTeam_Name: string | undefined;
};

export type Elements<T extends Items> = T extends AdminItems ? AdminElements<T> : NormalElements<T>;
export type AdminElements<T extends AdminItems> = T extends AdminMember ? AdminMemberCard : T extends AdminTeam ? AdminTeamCard : T extends AdminTrainer ? AdminTrainerCard : never;
export type NormalElements<T extends Items> = T extends Member ? MemberCard : T extends Team ? TeamCard : T extends Trainer ? TrainerCard : never;
