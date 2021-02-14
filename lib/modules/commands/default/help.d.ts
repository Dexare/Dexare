import Eris from 'eris';
import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export declare class HelpCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<string | {
        embed: Eris.EmbedOptions;
        content?: undefined;
        allowedMentions?: undefined;
    } | {
        content: string;
        allowedMentions: {
            repliedUser: boolean;
            users: boolean;
            roles: boolean;
            everyone: boolean;
        };
        embed?: undefined;
    } | undefined>;
}
