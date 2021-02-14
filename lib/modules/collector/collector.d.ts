import Collection from '@discordjs/collection';
import CollectorModule from '.';
import DexareClient, { DexareEvents } from '../../client';
import { EventHandlers } from '../../client/events';
import TypedEmitter from '../../util/typedEmitter';
export declare type CollectorEvents = {
    collect: (...args: any[]) => void;
    dispose: (...args: any[]) => void;
    end: (collected: Collection<any, any>, reason: string) => void;
};
export declare type CollectorFilter = (...args: any[]) => boolean | Promise<boolean>;
export interface CollectorOptions {
    /** How long to run the collector for in milliseconds */
    time?: number;
    /** How long to stop the collector after inactivity in milliseconds */
    idle?: number;
    /** Whether to dispose data when it's deleted */
    dispose?: boolean;
}
export interface ResetTimerOptions {
    /** How long to run the collector for in milliseconds */
    time?: number;
    /** How long to stop the collector after inactivity in milliseconds */
    idle?: number;
}
declare const Collector_base: new () => TypedEmitter<CollectorEvents>;
export default class Collector extends Collector_base {
    readonly module: CollectorModule;
    readonly client: DexareClient;
    /** The filter applied to this collector */
    readonly filter: CollectorFilter;
    /** The options of this collector */
    readonly options: CollectorOptions;
    /** The items collected by this collector */
    readonly collected: Collection<any, any>;
    /** Whether this collector has finished collecting */
    ended: boolean;
    private _timeout;
    private _idletimeout;
    id: string;
    constructor(collectorModule: CollectorModule, filter: CollectorFilter, options?: CollectorOptions);
    registerEvent<E extends keyof DexareEvents>(event: E, handler: EventHandlers[E], options?: {
        before?: string[];
        after?: string[];
    }): void;
    /**
     * Call this to handle an event as a collectable element. Accepts any event data as parameters.
     * @param args The arguments emitted by the listener
     */
    handleCollect(...args: any[]): Promise<void>;
    /**
     * Call this to remove an element from the collection. Accepts any event data as parameters.
     * @param args The arguments emitted by the listener
     */
    handleDispose(...args: any[]): void;
    /**
     * Returns a promise that resolves with the next collected element;
     * rejects with collected elements if the collector finishes without receiving a next element
     */
    get next(): Promise<unknown>;
    /**
     * Stops this collector and emits the `end` event.
     * @param reason the reason this collector is ending
     */
    stop(reason?: string): void;
    /**
     * Resets the collectors timeout and idle timer.
     * @param {Object} [options] Options
     * @param {number} [options.time] How long to run the collector for in milliseconds
     * @param {number} [options.idle] How long to stop the collector after inactivity in milliseconds
     */
    resetTimer(options?: ResetTimerOptions): void;
    /** Checks whether the collector should end, and if so, ends it. */
    checkEnd(): void;
    /**
     * Allows collectors to be consumed with for-await-of loops
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
     */
    [Symbol.asyncIterator](): AsyncGenerator<any, void, unknown>;
    /**
     * Handles incoming events from the `handleCollect` function. Returns null if the event should not
     * be collected, or returns an object describing the data that should be stored.
     * @see Collector#handleCollect
     * @param args Any args the event listener emits
     * @returns Data to insert into collection, if any
     */
    collect(...args: any[]): {
        key: any;
        value: any;
    } | void | null;
    /**
     * Handles incoming events from the `handleDispose`. Returns null if the event should not
     * be disposed, or returns the key that should be removed.
     * @see Collector#handleDispose
     * @param args Any args the event listener emits
     * @returns Key to remove from the collection, if any
     */
    dispose(...args: any[]): any;
    /** The reason this collector has ended or will end with. */
    endReason(): string | void | null;
}
export {};
