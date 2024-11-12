export class CallbackRegistry<T> {
	private AddCB: Set<(item: T) => void> = new Set();
	private UpdateCB: Set<(item: T) => void> = new Set();
	private DeleteCB: Set<(item: T) => void> = new Set();

	RegAdd = (cb: (item: T) => void) => {
		this.AddCB.add(cb);
	};

	RegUpdate = (cb: (item: T) => void) => {
		this.UpdateCB.add(cb);
	};

	RegDelete = (cb: (item: T) => void) => {
		this.DeleteCB.add(cb);
	};

	Add = (item: T) => {
		for (const cb of this.AddCB) cb(item);
	};

	Update = (item: T) => {
		for (const cb of this.UpdateCB) cb(item);
	};

	Delete = (item: T) => {
		for (const cb of this.DeleteCB) cb(item);
	};
}
