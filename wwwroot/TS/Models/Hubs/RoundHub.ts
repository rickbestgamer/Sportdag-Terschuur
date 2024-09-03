export class RoundHub {
	Rounds: Round[] = [];

	constructor() {}

	NewRound = () => {
		this.Rounds.push(new Round());
	};

	ServerUpdate = () => {};
	ServerDelete = () => {};
	ServerAdd = () => {};
}

class Round {
	constructor() {}
}
