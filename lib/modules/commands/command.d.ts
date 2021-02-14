import Eris from 'eris';
import CommandsModule from '.';
import DexareClient from '../../client';
import CommandContext from './context';
import { ClientEvent } from '../../client/events';
/** The options for a {@link DexareCommand}. */
export interface CommandOptions {
    /** The name of the command. */
    name: string;
    /** The command's aliases. */
    aliases?: string[];
    /** The command's category. */
    category?: string;
    /** The description of the command. */
    description?: string;
    /** The required permission(s) for a user to use this command. */
    userPermissions?: string[];
    /** The required client permission(s) for this command. */
    clientPermissions?: string[];
    /** The throttling options for the command. */
    throttling?: ThrottlingOptions;
    /** Metadata for the command. Useful for any other identifiers for the command. */
    metadata?: any;
}
/** The throttling options for a {@link DexareCommand}. */
export interface ThrottlingOptions {
    /** Maximum number of usages of the command allowed in the time frame. */
    usages: number;
    /** Amount of time to count the usages of the command within (in seconds). */
    duration: number;
    /** The Dexare permissions that can bypass throttling. */
    bypass?: string[];
}
/** @private */
export interface ThrottleObject {
    start: number;
    usages: number;
    timeout: any;
}
export default class DexareCommand {
    /** The command's name. */
    readonly name: string;
    /** The command's aliases. */
    readonly aliases: string[];
    /** The command's category. */
    readonly category: string;
    /** The command's description. */
    readonly description?: string;
    /** The permissions required to use this command. */
    readonly userPermissions?: Array<string>;
    /** The permissions the client is required to have for this command. */
    readonly clientPermissions?: Array<string>;
    /** The throttling options for this command. */
    readonly throttling?: ThrottlingOptions;
    /** Metadata for the command. */
    readonly metadata?: any;
    /**
     * The file path of the command.
     * Used for refreshing the require cache.
     * Set this to `__filename` in the constructor to enable cache clearing.
     */
    filePath?: string;
    /** The commands module. */
    readonly cmdsModule: CommandsModule<DexareClient<any>>;
    /** The client from the commands module. */
    readonly client: DexareClient<any>;
    /** Current throttle objects for the command, mapped by user ID. */
    private _throttles;
    /** Whether the command is enabled globally */
    private _globalEnabled;
    /**
     * @param creator The instantiating creator.
     * @param opts The options for the command.
     */
    constructor(client: DexareClient<any>, opts: CommandOptions);
    /**
     * Checks whether the context member has permission to use the command.
     * @param ctx The triggering context
     * @return {boolean|string} Whether the member has permission, or an error message to respond with if they don't
     */
    hasPermission(ctx: CommandContext, event?: ClientEvent): boolean | string;
    /**
     * Called when the command is prevented from running.
     * @param ctx Command context the command is running from
     * @param reason Reason that the command was blocked
     * (built-in reasons are `permission`, `throttling`)
     * @param data Additional data associated with the block.
     * - permission: `response` ({@link string}) to send
     * - throttling: `throttle` ({@link Object}), `remaining` ({@link number}) time in seconds
     */
    onBlock(ctx: CommandContext, reason: string, data?: any): Promise<Eris.Message<Eris.TextableChannel>> | null;
    /**
     * Called when the command produces an error while running.
     * @param err Error that was thrown
     * @param ctx Command context the command is running from
     */
    onError(err: Error, ctx: CommandContext): Promise<Eris.Message<Eris.TextableChannel>>;
    /**
     * Checks if the command is usable for a message
     * @param message The message
     */
    isUsable(ctx: CommandContext): boolean;
    /**
     * Creates/obtains the throttle object for a user, if necessary.
     * @param userID ID of the user to throttle for
     * @private
     */
    throttle(object: Eris.Message | Eris.User | Eris.Member, event?: ClientEvent): Promise<ThrottleObject | null | undefined>;
    /**
     * Runs the command.
     * @param ctx The context of the message
     */
    run(ctx: CommandContext): Promise<string | Eris.MessageContent | void>;
    /**
     * Preloads the command.
     * This function is called upon loading the command, NOT after logging in.
     */
    preload(): Promise<any>;
    /** Reloads the command. */
    reload(): void;
    /** Unloads the command. */
    unload(): void;
    /**
     * Finalizes the return output
     * @param response The response from the command run
     * @param ctx The context of the message
     * @private
     */
    finalize(response: any, ctx: CommandContext): Promise<Eris.Message<Eris.TextableChannel>> | undefined;
}
