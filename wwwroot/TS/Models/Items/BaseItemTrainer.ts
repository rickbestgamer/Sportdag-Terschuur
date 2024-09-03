import { ItemsTrainer } from "../Types";
import { BaseItem } from "./BaseItem";
import { BaseItemChild } from "./BaseItemChild";

export class BaseItemTrainer<T extends ItemsTrainer> extends BaseItem<T> {}

export class ItemTrainer<T extends ItemsTrainer> extends BaseItemChild {}
