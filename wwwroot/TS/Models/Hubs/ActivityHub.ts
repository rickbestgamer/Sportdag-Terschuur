export class ActivityHub {
	Activities: Activity[] = [];

	constructor() {}

	NewActivity = () => {
		this.Activities.push(new Activity());
	};

	ServerUpdate = () => {};
	ServerDelete = () => {};
	ServerAdd = () => {};
}

class Activity {
	constructor() {}
}
