import Collection from '@discordjs/collection';
import DexareClient from '../../client';
import DexareModule from '../../module';
import DexareCommand from './command';
import CommandContext from './context';
/** The default command names available. */
export declare type DefaultCommand = 'eval' | 'help' | 'ping';
/** The commands module in Dexare. */
export default class CommandsModule<T extends DexareClient<any>> extends DexareModule<T> {
    /** The commands loaded into the module. */
    readonly commands: Collection<string, DexareCommand>;
    constructor(client: T);
    /** @hidden */
    load(): void;
    /** @hidden */
    unload(): void;
    /**
     * Registers a command.
     * @param command The command to register
     */
    register(command: any): DexareCommand;
    /**
     * Registers commands from a folder.
     * @param path The path to register from.
     */
    registerFromFolder(path: string): Promise<any>;
    /**
     * Re-registers a command.
     * @param command The new command
     * @param oldCommand The old command
     */
    reregister(command: any, oldCommand: DexareCommand): void;
    /**
     * Unregisters a command.
     * @param command The command to unregister
     */
    unregister(command: DexareCommand): void;
    /**
     * Find commands with a query.
     * @param searchString The string to search with
     * @param ctx The context to check with
     */
    find(searchString: string, ctx?: CommandContext): DexareCommand[];
    /**
     * Registers default commands. (eval, help, ping)
     * @param commands The commands to register, if not defined, all commands are used.
     */
    registerDefaults(commands?: DefaultCommand[]): void;
    /** @hidden */
    private _escapeRegExp;
    /** @hidden */
    private _buildPrefixes;
    /** @hidden */
    private _logCommand;
    /** @hidden */
    private onMessage;
}
