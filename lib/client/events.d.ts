import Collection from '@discordjs/collection';
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
/** An object that temporarily stores the data of an event. */
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
     * @param key The key to check
     */
    has(key: string): boolean;
    /**
     * Gets a key within the event's data.
     * @param key The key to get
     */
    get(key: string): any;
    /**
     * Sets a key within the event's data.
     * @param key The key to set
     * @param value The data
     */
    set(key: string, data: any): Map<string, any>;
}
/** The event registry that handles the event system. */
export default class EventRegistry<T extends DexareClient<any>> {
    /** The event groups in the registry. */
    readonly eventGroups: Collection<string, EventGroup>;
    /** the client responsible for this registry. */
    readonly client: T;
    private readonly loadOrders;
    private readonly hookedEvents;
    private readonly logger;
    constructor(client: T);
    /**
     * Registers an event.
     * @param groupName The group to register with
     * @param event The event to register
     * @param listener The event listener
     * @param options The options for the event
     */
    register<E extends keyof DexareEvents>(groupName: string, event: E, listener: EventHandlers[E], options?: {
        before?: string[];
        after?: string[];
    }): void;
    /**
     * Unregisters an event from a group.
     * @param groupName The group to unregister from
     * @param event The event to unregister
     */
    unregister(groupName: string, event: keyof DexareEvents): void;
    /**
     * Unregisters a group, removing all of their listeners.
     * @param groupName The group to unregister
     */
    unregisterGroup(groupName: string): boolean;
    /**
     * Emits an event.
     * @param event The event to emit
     * @param args The arcuments to emit with
     */
    emit<E extends keyof DexareEvents>(event: E, ...args: Arguments<DexareEvents[E]>): void;
    /**
     * Emits an event asynchronously.
     * @param event The event to emit
     * @param args The arcuments to emit with
     */
    emitAsync<E extends keyof DexareEvents>(event: E, ...args: Arguments<DexareEvents[E]>): Promise<void>;
    private hookEvent;
    private refreshLoadOrder;
    private refreshAllLoadOrders;
    private createLoadOrder;
}
