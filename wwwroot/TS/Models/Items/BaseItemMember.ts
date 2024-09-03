import { ItemsMember } from "../Types";
import { BaseItem } from "./BaseItem";
import { BaseItemChild } from "./BaseItemChild";

export class BaseItemMember<T extends ItemsMember> extends BaseItem<T> {
	
}

export class ItemMember<T extends ItemsMember> extends BaseItemChild{
    
}