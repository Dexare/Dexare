import Collection from '@discordjs/collection';
import DexareClient from '../../client';
import DexareModule from '../../module';
import DexareCommand from './command';
import CommandContext from './context';
export declare type DefaultCommand = 'eval' | 'help' | 'ping';
export default class CommandsModule<T extends DexareClient<any>> extends DexareModule<T> {
    readonly commands: Collection<string, DexareCommand>;
    constructor(client: T);
    load(): void;
    unload(): void;
    register(command: any): DexareCommand;
    registerFromFolder(path: string): Promise<any>;
    reregister(command: any, oldCommand: DexareCommand): void;
    unregister(command: DexareCommand): void;
    find(searchString: string, ctx?: CommandContext): DexareCommand[];
    registerDefaults(commands?: DefaultCommand[]): void;
    private _escapeRegExp;
    private _buildPrefixes;
    private _logCommand;
    private onMessage;
}
