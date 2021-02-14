import { Arguments } from '../util/typedEmitter';
import DexareClient, { DexareEvents } from './index';
/** @hidden */
export declare type EventHandlers = {
    [event in keyof DexareEvents]: (event: ClientEvent, ...args: Arguments<DexareEvents[event]>) => Promise<void> | void;
} & {
    [event: string]: (event: ClientEvent, ...args: any[]) => Promise<void> | void;
};
/** @hidden */
export declare type EventGroup = {
    [event in keyof EventHandlers]?: {
        group: string;
        before: string[];
        after: string[];
        listener: EventHandlers[event];
    };
} & {
    [event: string]: {
        group: string;
        before: string[];
        after: string[];
        listener: (event: ClientEvent, ...args: any[]) => Promise<void> | void;
    };
};
export declare class ClientEvent {
    /** The groups that have been (or will be) skipped. */
    readonly skipped: string[];
    /** The name of this event. */
    readonly name: keyof DexareEvents;
    /** The data for this event. Can be altered at any time */
    readonly data: Map<string, any>;
    constructor(name: keyof DexareEvents);
    /**
     * Skip a group's listener for this event, if it has not already been fired.
     * @param group The group/extension/module name
     */
    skip(group: string): void;
    /**
     * Whether a data key exists within the data.
     */
    has(key: string): boolean;
    /**
     * Gets a key within the event's data.
     */
    get(key: string): any;
    /**
     * Sets a key within the event's data.
     */
    set(key: string, data: any): Map<string, any>;
}
export default class EventRegistry<T extends DexareClient<any>> {
    private readonly eventGroups;
    private readonly loadOrders;
    private readonly hookedEvents;
    private readonly logger;
    private readonly client;
    constructor(client: T);
    register<E extends keyof DexareEvents>(groupName: string, event: E, listener: EventHandlers[E], options?: {
        before?: string[];
        after?: string[];
    }): void;
    unregister(groupName: string, event: keyof DexareEvents): void;
    unregisterGroup(groupName: string): boolean;
    emit<E extends keyof DexareEvents>(event: E, ...args: Arguments<DexareEvents[E]>): void;
    emitAsync<E extends keyof DexareEvents>(event: E, ...args: Arguments<DexareEvents[E]>): Promise<void>;
    private hookEvent;
    private refreshLoadOrder;
    private refreshAllLoadOrders;
    private createLoadOrder;
}
