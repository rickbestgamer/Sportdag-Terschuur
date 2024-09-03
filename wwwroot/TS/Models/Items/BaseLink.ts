import { Select } from '../Hubs/SignalRHub';
import { Items, ItemParent } from '../Types';
export class BaseLink<T extends Items>{
    Parent: T;
    readonly ID: number
    Select: Select
}