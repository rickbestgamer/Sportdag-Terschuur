abstract class BaseLinkItem {
	constructor(public name: string) {}
}

abstract class BaseLinkHub<T extends BaseLinkItem> {
	private static hubs: Map<string, BaseLinkHub<BaseLinkItem>> = new Map();
	protected linkItems: T[] = [];
	private observers: ((linkItem: T) => void)[] = [];

	static getHubInstance<U extends BaseLinkHub<BaseLinkItem>>(this: new () => U): U {
		const typeName = this.name;
		if (!BaseLinkHub.hubs.has(typeName)) {
			BaseLinkHub.hubs.set(typeName, new this());
		}
		return BaseLinkHub.hubs.get(typeName) as U;
	}

	addLinkItem = (linkItem: T) => {
		this.linkItems.push(linkItem);
		this.notifyObservers(linkItem);
	};

	getLinkItems = (): T[] => {
		return this.linkItems;
	};

	registerObserver = (observer: (linkItem: T) => void) => {
		this.observers.push(observer);
		this.linkItems.forEach(observer);
	};

	private notifyObservers = (linkItem: T) => {
		this.observers.forEach((observer) => observer(linkItem));
	};
}

class LinkHub<T extends BaseLinkItem> extends BaseLinkHub<T> {
	static registerObserver(observer: (linkItem: LinkItemTeam) => void) {
		this.getHubInstance().registerObserver(observer);
	}
}

class LinkItemMember extends BaseLinkItem {}
class LinkItemTeam extends BaseLinkItem {}
class LinkItemTrainer extends BaseLinkItem {}

class LinkHubTeam extends LinkHub<LinkItemTeam> {}
class LinkHubMember extends LinkHub<LinkItemMember> {}
class LinkHubTrainer extends LinkHub<LinkItemTrainer> {}

class TeamHub {
	linkHub: LinkHubTeam;

	constructor() {
		this.linkHub = LinkHubTeam.getHubInstance();
		this.initializeTeams();
	}

	initializeTeams() {
		this.NewItem("Team a");
		this.NewItem("Team B");
	}

	NewItem = (name: string) => {
		this.linkHub.addLinkItem(new LinkItemTeam(name));
	};
}

class MemberHub {
	linkHub: LinkHubMember;

	constructor() {
		this.linkHub = LinkHubMember.getHubInstance();
		LinkHubTeam.registerObserver(this.handleTeamUpdate);
	}

	private handleTeamUpdate = (linkItem: LinkItemTeam) => {
		console.log(linkItem.name);
	};
}

class TrainerHub {
	linkHub: LinkHubTrainer;

	constructor() {
		this.linkHub = LinkHubTrainer.getHubInstance();
		LinkHubTeam.registerObserver(this.handleTeamUpdate);
	}

	private handleTeamUpdate = (linkItem: LinkItemTeam) => {
		console.log(linkItem.name);
	};
}

const member = new MemberHub();
const team = new TeamHub();
const trainer = new TrainerHub();

console.log(member.linkHub);
console.log(team.linkHub);
console.log(trainer.linkHub);

team.NewItem("New Team");
