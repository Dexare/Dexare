import Collection from '@discordjs/collection';
import Eris from 'eris';
import DexareModule from '../module';
import CommandsModule from '../modules/commands';
import { ErisEvents, LoggerExtra } from '../types';
import LoggerHandler from '../util/logger';
import TypedEmitter from '../util/typedEmitter';
import EventRegistry from './events';
import PermissionRegistry from './permissions';
export interface BaseConfig {
    token: string;
    erisOptions?: Eris.ClientOptions;
    elevated?: string | Array<string>;
}
/**
 * The events typings for the {@link DexareClient}.
 * @private
 */
export interface DexareClientEvents extends ErisEvents {
    logger(level: string, group: string, args: any[], extra?: LoggerExtra): void;
}
/** @hidden */
export declare type DexareEvents = DexareClientEvents & {
    [event: string]: (...args: any[]) => void;
};
declare const DexareClient_base: new () => TypedEmitter<DexareEvents>;
export default class DexareClient<T extends BaseConfig = BaseConfig> extends DexareClient_base {
    config: T;
    readonly bot: Eris.Client;
    readonly permissions: PermissionRegistry<this>;
    readonly events: EventRegistry<this>;
    readonly logger: LoggerHandler<this>;
    readonly modules: Collection<string, DexareModule<this>>;
    readonly commands: CommandsModule<this>;
    readonly collector: CommandsModule<this>;
    private readonly _typingIntervals;
    private readonly _hookedEvents;
    private _erisEventsLogged;
    constructor(config: T);
    /**
     * Load modules into the client.
     * @param moduleObjects The modules to load.
     */
    loadModules(...moduleObjects: any[]): this;
    /**
     * Log events to console.
     * @param logLevel The level to log at.
     * @param excludeModules The modules to exclude
     */
    logToConsole(logLevel?: 'debug' | 'info' | 'warn' | 'error', excludeModules?: string[]): this;
    /** Logs informational Eris events to Dexare's logger event. */
    logErisEvents(): this;
    /**
     * Register an event.
     * @param event The event to register
     * @param listener The event listener
     */
    on<E extends keyof DexareEvents>(event: E, listener: DexareEvents[E]): this;
    /**
     * Creates a promise that resolves on the next event
     * @param event The event to wait for
     */
    waitTill(event: keyof DexareEvents): Promise<unknown>;
    /** Connects and logs in to Discord. */
    connect(): Promise<void>;
    /** Disconnects the bot. */
    disconnect(reconnect?: boolean | 'auto'): void;
    /**
     * Start typing in a channel
     * @param channelID The channel's ID to start typing in
     */
    startTyping(channelID: string): Promise<void>;
    /**
     * Whether the bot is currently typing in a channel.
     * @param channelID The channel ID to check for
     */
    isTyping(channelID: string): boolean;
    /**
     * Stops typing in a channel.
     * @param channelID The channel's ID to stop typing in
     */
    stopTyping(channelID: string): void;
    /** @hidden */
    private _resolveModule;
    /** @hidden */
    private _getLoadOrder;
}
export {};
