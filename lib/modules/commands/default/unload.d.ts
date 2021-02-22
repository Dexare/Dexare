import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export default class UnloadCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<string>;
}
