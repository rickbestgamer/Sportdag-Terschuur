export class ItemCollection<T> {
	private Items: Set<T> = new Set();

	Add = (item: T) => {
		this.Items.add(item);
	};

	Delete = (item: T) => {
		this.Items.delete(item);
	};

	GetItems = (): Set<T> => {
		return this.Items;
	};

	All = (callback: (item: T) => void) => {
		for (const item of this.Items) callback(item);
	};
}
