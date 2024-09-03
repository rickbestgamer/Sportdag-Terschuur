import { CustomMap } from "./CustomMap";
import { StringToElement } from "./Functions";
import { Point } from "./Points";

class Activity {
	Select: HTMLSelectElement;
	Point: Point;

	constructor(element: HTMLSelectElement, point: Point) {
		this.Select = element;
		this.Point = point;

		this.Select.addEventListener("change", this.UpdateType);
	}

	UpdateType = () => {
		this.Point.Type = parseInt(this.Select.value);
		UpdatePoint(this.Point);
	};
}

declare const imagePath: string;
const canvas = document.getElementById("FieldCanvas") as HTMLCanvasElement;
const map = new CustomMap(canvas, imagePath);
const observer = new ResizeObserver(() => {
	map.resize();
});
observer.observe(canvas);
const addButtonWrapper = document.getElementById("FieldWrapper")!.querySelector("#MapAddWrapper")!;
const addButton = addButtonWrapper.querySelector("#MapAddButton")!;
const addFieldWrapper = document.getElementById("AddActivityWrapper")!;
const addFieldForm = addFieldWrapper.querySelector("#AddActivityForm")! as HTMLFormElement;
const addField = addFieldForm.querySelector("#AddActivityField")! as HTMLInputElement;
let activities = document.getElementsByClassName("ActivityWrapper");

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

addButtonWrapper?.addEventListener("click", () => {
	addFieldWrapper.style.scale = addFieldWrapper.style.scale == "1" ? "0" : "1";
	addButton.classList.toggle("Open");
});

addFieldWrapper?.querySelector("button")?.addEventListener("click", NewActivity);

addFieldForm.addEventListener("submit", (e) => {
	e.preventDefault();
	NewActivity();
});

for (let activityWrapper of activities as HTMLCollectionOf<HTMLElement>) {
	const activity = activityWrapper.querySelector(".Activity") as HTMLElement;
	let xStr = activity.getAttribute("PosX");
	let yStr = activity.getAttribute("PosY");
	let idStr = activity.getAttribute("ID");
	let lStr = activity.getAttribute("Name");
	let tStr = activity.getAttribute("Type");
	activity.removeAttribute("PosX");
	activity.removeAttribute("PosY");
	activity.removeAttribute("ID");
	activity.removeAttribute("Name");
	activity.removeAttribute("Type");

	if (xStr !== null && yStr !== null && idStr !== null && lStr !== null && tStr !== null) {
		let x = parseInt(xStr);
		let y = parseInt(yStr);
		let id = parseInt(idStr);
		let type = parseInt(tStr);
		let point = new Point(lStr, type, ease, x, y, id);
		let select = activityWrapper.querySelector("select")!;
		new Activity(select, point);
		map.Points.push(point);
		activityWrapper.querySelector("button")!.addEventListener("click", async () => {
			RemoveActivity(point, activityWrapper);
		});
	}
}

canvas.addEventListener("mousedown", (e: MouseEvent) => {
	if (map.NewPoint) {
		CreatePoint(map.NewPoint);
	}
	map.MouseListeners.MouseDown(e);
});

canvas.addEventListener("mouseup", () => {
	map.Points.forEach((point) => {
		if (point.Dragging) {
			UpdatePoint(point);
		}
	});
	map.MouseListeners.MouseUp();
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
	map.MouseListeners.MouseMove(e);
});

canvas.addEventListener("mouseleave", (e: MouseEvent) => {
	map.MouseListeners.MouseLeave(e);
});

canvas.addEventListener(
	"wheel",
	(e) => {
		map.MouseListeners.Wheel(e);
	},
	{ passive: false }
);

canvas.addEventListener(
	"touchstart",
	(e) => {
		if (map.NewPoint) {
			CreatePoint(map.NewPoint);
		}
		map.TouchListener.TouchStart(e);
	},
	{ passive: false }
);

canvas.addEventListener(
	"touchmove",
	(e) => {
		map.TouchListener.TouchMove(e);
	},
	{ passive: false }
);

canvas.addEventListener("touchend", (e) => {
	map.Points.forEach((point) => {
		if (point.Dragging) {
			UpdatePoint(point);
		}
	});
	map.TouchListener.TouchEnd(e);
});

canvas.addEventListener("touchcancel", (e) => {
	map.TouchListener.TouchCancel(e);
});

declare const UpdateFetchPath: string;

function NewActivity() {
	const inputValue = addField.value;
	const selectValue = addFieldWrapper.querySelector("select")!.value;
	let type = parseInt(selectValue);
	let Exist: boolean = false;

	map.Points.forEach((point) => {
		if (point.Label == inputValue) Exist = true;
	});

	if (inputValue == "" || Exist) return;

	map.NewPoint = new Point(inputValue, type, ease, undefined, undefined, undefined, true);
	addFieldWrapper.style.scale = "0";
	addButton.classList.toggle("Open", false);
	addField.value = "";
}

async function RemoveActivity(point: Point, activityWrapper: HTMLElement) {
	let completed: boolean = await PointFetch(point, "delete");

	if (!completed) return;

	delete map.Points[map.Points.indexOf(point)];

	RemoveAnimation(activityWrapper);
}

async function RemoveAnimation(activityWrapper: HTMLElement) {
	const time: number = 0.8;

	activityWrapper.style.height = activityWrapper.clientHeight + "px";

	activityWrapper.getBoundingClientRect();

	activityWrapper.style.transition = time + "s";
	activityWrapper.style.opacity = "0";
	activityWrapper.style.scale = "1 0";
	activityWrapper.style.height = "0px";
	activityWrapper.style.paddingBlock = "0";
	activityWrapper.style.marginBottom = "0";
	activityWrapper.style.pointerEvents = "none";

	await new Promise((resolve) => setTimeout(resolve, time * 1000));

	activityWrapper.remove();
}

async function EnterAnimation(activityWrapper: HTMLElement) {
	const time: number = 0.8;

	activityWrapper.style.transition = time + "s";
	activityWrapper.style.opacity = "0";
	activityWrapper.style.scale = "1 0";
	activityWrapper.style.paddingBlock = "0";
	activityWrapper.style.marginBottom = "0";
	activityWrapper.style.pointerEvents = "none";

	activityWrapper.getBoundingClientRect();

	activityWrapper.style.opacity = "1";
	activityWrapper.style.scale = "1 1";
	activityWrapper.style.paddingBlock = "2rem";
	activityWrapper.style.marginBottom = "2rem";
	activityWrapper.style.pointerEvents = "all";

	await new Promise((resolve) => setTimeout(resolve, time * 1000));

	activityWrapper.style.transition = "";
}

function CreatePoint(point: Point) {
	PointFetch(point, "create");
}

function UpdatePoint(point: Point) {
	PointFetch(point, "update");
}

async function PointFetch(point: Point, fetchType: string): Promise<boolean> {
	if (!point.PosX || !point.PosY) return false;

	const x: number = point.PosX,
		y: number = point.PosY,
		label: string = point.Label,
		type: number = point.Type;
	let id: number | undefined = undefined;
	let result: boolean = false;

	if (point.ID) {
		id = point.ID;
	}

	if (UpdateFetchPath !== undefined) {
		const path = `${UpdateFetchPath}&Statement=${fetchType}&X=${x}&Y=${y}&Label=${label}&Type=${type}${id ? `&ID=${id}` : ``}`;
		await fetch(path)
			.then((response) => response.json())
			.then((data) => {
				result = data["status"];
				if (data["id"]) {
					const firstChild = StringToElement(data["string"]);
					const button = firstChild.querySelector("button") as HTMLButtonElement;

					button.addEventListener("click", async () => {
						RemoveActivity(point, firstChild);
					});

					point.ID = parseInt(data["id"]);
					document.getElementById("ActivityList")?.appendChild(firstChild);
					EnterAnimation(firstChild);
				}
			});
	}
	return result;
}
