import DexareClient, { DexareEvents } from './client';
import { EventHandlers } from './client/events';
import LoggerHandler from './util/logger';
/** Options for the {@link DexareModule}. */
export interface ModuleOptions {
    name: string;
    requires?: string[];
}
/** A module for Dexare. */
export default class DexareModule<T extends DexareClient<any>> {
    /** The options for this module. */
    readonly options: ModuleOptions;
    /** @hidden */
    readonly registerQueue: [
        {
            event: keyof DexareEvents;
            before?: string[];
            after?: string[];
        },
        EventHandlers[keyof DexareEvents]
    ][];
    /** The logger for the module. */
    readonly logger: LoggerHandler<T>;
    /** The Dexare client for this module. */
    readonly client: T;
    /** Whether the module has been loaded. */
    loaded: boolean;
    constructor(client: T, options: ModuleOptions);
    /** @hidden */
    _load(): void;
    /** Fired when this module is loaded. */
    load(): void;
    /** Fired when this module is being unloaded. */
    unload(): void;
    /**
     * Registers an event for this module.
     * @param event The event to register
     * @param handler The event handler
     * @param options The options for the handler
     */
    registerEvent<E extends keyof DexareEvents>(event: E, handler: EventHandlers[E], options?: {
        before?: string[];
        after?: string[];
    }): void;
    /**
     * Unregisters an event from this module.
     * @param event The event to unregister
     */
    unregisterEvent(event: keyof DexareEvents): void;
    /** Unregisters all events from this module. */
    unregisterAllEvents(): boolean;
}
