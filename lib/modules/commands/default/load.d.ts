import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export default class LoadCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<string>;
}
