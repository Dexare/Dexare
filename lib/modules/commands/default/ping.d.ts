import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export default class PingCommand extends DexareCommand {
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<import("eris").Message<import("eris").TextableChannel>>;
}
