import DexareClient, { DexareEvents } from './client';
import { EventHandlers } from './client/events';
import LoggerHandler from './util/logger';
export interface ModuleOptions {
    name: string;
    requires?: string[];
}
export default class DexareModule<T extends DexareClient<any>> {
    readonly options: ModuleOptions;
    readonly registerQueue: [
        {
            event: keyof DexareEvents;
            before?: string[];
            after?: string[];
        },
        EventHandlers[keyof DexareEvents]
    ][];
    readonly logger: LoggerHandler<T>;
    readonly client: T;
    loaded: boolean;
    constructor(client: T, options: ModuleOptions);
    /** @hidden */
    _load(): void;
    /** Fired when this module is loaded. */
    load(): void;
    /** Fired when this module is being unloaded. */
    unload(): void;
    registerEvent<E extends keyof DexareEvents>(event: E, handler: EventHandlers[E], options?: {
        before?: string[];
        after?: string[];
    }): void;
    unregisterEvent(event: keyof DexareEvents): void;
    unregisterAllEvents(): boolean;
}
