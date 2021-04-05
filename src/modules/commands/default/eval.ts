import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';
import util from 'util';
import { escapeRegex } from '../../../util';

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

export default class EvalCommand extends DexareCommand {
  private _sensitivePattern?: RegExp;
  private hrStart?: [number, number];
  private lastResult?: any;

  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'eval',
      description: 'Evaluates code.',
      category: 'Developer',
      userPermissions: ['dexare.elevated'],
      metadata: {
        examples: ['eval 1+1', 'eval someAsyncFunction.then(callback)'],
        usage: '<code>',
        details:
          'Only the bot owner(s) may use this command. Can use `message`, `client`, `lastResult`, `event` and `callback` in evaluation.'
      }
    });

    Object.defineProperty(this, '_sensitivePattern', {
      value: null,
      configurable: true
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    let evalString: string = ctx.event
      .get('commands/strippedContent')
      .slice(ctx.event.get('commands/commandName').length + 1)
      .trim();

    if (evalString.startsWith('```') && evalString.endsWith('```'))
      evalString = evalString.replace(/(^.*?\s)|(\n.*$)/g, '');

    if (!evalString) return 'This command requires some code.';

    /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
    const message = ctx.message;
    const client = ctx.client;
    const event = ctx.event;
    const lastResult = this.lastResult;
    const callback = (val: any) => {
      if (val instanceof Error) ctx.reply(`Callback error: \`${val}\``);
      else {
        const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
        ctx.reply(result);
      }
    };
    /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

    let hrDiff;
    try {
      const hrStart = process.hrtime();
      this.lastResult = eval(evalString);
      hrDiff = process.hrtime(hrStart);
    } catch (err) {
      return `Error while evaluating: \`${err}\``;
    }

    this.hrStart = process.hrtime();
    return this.makeResultMessages(this.lastResult, hrDiff, evalString);
  }

  makeResultMessages(result: any, hrDiff: [number, number], input?: string) {
    const inspected = util
      .inspect(result, { depth: 0 })
      .replace(nlPattern, '\n')
      .replace(this.sensitivePattern, '--snip--');
    if (input) {
      return (
        `*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n\`\`\`js\n` +
        inspected.slice(0, 1900) +
        `\`\`\``
      );
    } else {
      return (
        `*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${
          hrDiff[1] / 1000000
        }ms.*\n\`\`\`js\n` +
        inspected.slice(0, 1900) +
        `\`\`\``
      );
    }
  }

  get sensitivePattern() {
    if (!this._sensitivePattern) {
      // @ts-ignore
      const token = this.client.bot._token;
      let pattern = '';
      if (token) pattern += escapeRegex(token);
      Object.defineProperty(this, '_sensitivePattern', {
        value: new RegExp(pattern, 'gi'),
        configurable: false
      });
    }
    return this._sensitivePattern!;
  }
}
