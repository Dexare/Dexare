import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export default class ExecCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<"This command requires something to execute." | undefined>;
}
