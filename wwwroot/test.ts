interface LinkHubObserver {
	update(linkItem: BaseLinkItem): void;
}
abstract class BaseLinkHub<T extends BaseLinkItem> {
	protected linkItems: T[] = [];

	addLinkItem(linkItem: T) {
		this.linkItems.push(linkItem);
		LinkHubManager.notifyObservers(this.constructor as new () => BaseLinkHub<BaseLinkItem>, linkItem);
	}

	getLinkItems(): T[] {
		return this.linkItems;
	}
}
class LinkHubManager {
	private static linkHubs: Map<string, BaseLinkHub<BaseLinkItem>> = new Map();
	private static observers: Map<string, LinkHubObserver[]> = new Map();

	static getLinkHub = <T extends BaseLinkHub<BaseLinkItem>>(hubType: new () => T) => {
		const typeName = hubType.name;
		if (!this.linkHubs.has(typeName)) {
			this.linkHubs.set(typeName, new hubType());
		}
		return this.linkHubs.get(typeName) as T;
	};

	static addLinkItem<T extends BaseLinkHub<BaseLinkItem>>(hubType: new () => T, linkItem: BaseLinkItem) {
		const hub = this.getLinkHub(hubType);
		hub.addLinkItem(linkItem);
	}

	static registerObserver<T extends BaseLinkHub<BaseLinkItem>>(hubType: new () => T, observer: LinkHubObserver) {
		const typeName = hubType.name;
		if (!this.observers.has(typeName)) {
			this.observers.set(typeName, []);
		}
		this.observers.get(typeName)!.push(observer);

		const hub = this.getLinkHub(hubType);
		hub.getLinkItems().forEach((item) => observer.update(item));
	}

	static notifyObservers<T extends BaseLinkHub<BaseLinkItem>>(hubType: new () => T, linkItem: BaseLinkItem) {
		const typeName = hubType.name;
		if (this.observers.has(typeName)) {
			this.observers.get(typeName)!.forEach((observer) => observer.update(linkItem));
		}
	}
}

abstract class BaseLinkItem {
	constructor(public Name: string) {}
}

class LinkMember extends BaseLinkItem {}
class LinkTeam extends BaseLinkItem {
	constructor(public teamName: string) {
		super(teamName);
	}
}
class LinkTrainer extends BaseLinkItem {}

class LinkHubMember extends BaseLinkHub<LinkMember> {}
class LinkHubTeam extends BaseLinkHub<LinkTeam> {}
class LinkHubTrainer extends BaseLinkHub<LinkTrainer> {}

class MemberHub implements LinkHubObserver {
	constructor() {
		LinkHubManager.getLinkHub(LinkHubMember);
		LinkHubManager.registerObserver(LinkHubTeam, this); // Register as an observer to LinkHubTeam
		this.initializeMembers();
	}

	initializeMembers() {
		// Initialize members if needed
	}

	NewItem() {
		// Handle new items if needed
	}

	update(linkItem: BaseLinkItem) {
		if (linkItem instanceof LinkTeam) {
			console.log(`MemberHub received update: ${linkItem.teamName}`);
		}
	}
}

class TeamHub {
	constructor() {
		LinkHubManager.getLinkHub(LinkHubTeam);
		this.initializeTeams();
	}

	initializeTeams() {
		LinkHubManager.addLinkItem(LinkHubTeam, new LinkTeam("Team A"));
		LinkHubManager.addLinkItem(LinkHubTeam, new LinkTeam("Team B"));
	}

	NewItem(name: string) {
		const newTeam = new LinkTeam(name);
		LinkHubManager.addLinkItem(LinkHubTeam, newTeam);
	}
}

class TrainerHub implements LinkHubObserver {
	constructor() {
		LinkHubManager.getLinkHub(LinkHubTrainer);
		LinkHubManager.registerObserver(LinkHubTeam, this); // Register as an observer to LinkHubTeam
		this.initializeTrainers();
	}

	initializeTrainers() {
		// Initialize trainers if needed
	}

	NewItem() {
		// Handle new items if needed
	}

	update(linkItem: BaseLinkItem) {
		if (linkItem instanceof LinkTeam) {
			console.log(`TrainerHub received update: ${linkItem.Name}`);
		}
	}
}

function initializeHub<T extends TrainerHub | MemberHub | TeamHub>(HubClass: new () => T): T {
	const tmpHub = new HubClass();
	tmpHub.NewItem("New Team");
	return tmpHub;
}

const memberHub = initializeHub(MemberHub);
const teamHub = initializeHub(TeamHub);
const trainerHub = initializeHub(TrainerHub);
teamHub.NewItem("what");
