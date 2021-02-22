import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export default class ReloadCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    fileExists(path: string): boolean;
    run(ctx: CommandContext): Promise<string>;
}
