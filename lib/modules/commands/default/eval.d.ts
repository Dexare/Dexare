import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
export declare class EvalCommand extends DexareCommand {
    private _sensitivePattern?;
    private hrStart?;
    private lastResult?;
    constructor(client: DexareClient<any>);
    run(ctx: CommandContext): Promise<string>;
    makeResultMessages(result: any, hrDiff: [number, number], input?: string): string;
    get sensitivePattern(): RegExp;
}
