"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../command"));
const util_1 = __importDefault(require("util"));
const util_2 = require("../../../util");
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');
class EvalCommand extends command_1.default {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Evaluates code.',
            category: 'Developer',
            userPermissions: ['dexare.elevated'],
            metadata: {
                examples: ['eval 1+1', 'eval someAsyncFunction.then(callback)'],
                usage: '<code>',
                details: 'Only the bot owner(s) may use this command. Can use `message`, `client`, `lastResult`, `event` and `callback` in evaluation.'
            }
        });
        Object.defineProperty(this, '_sensitivePattern', {
            value: null,
            configurable: true
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        let evalString = ctx.event
            .get('commands/strippedContent')
            .slice(ctx.event.get('commands/commandName').length + 1)
            .trim();
        if (evalString.startsWith('```') && evalString.endsWith('```'))
            evalString = evalString.replace(/(^.*?\s)|(\n.*$)/g, '');
        if (!evalString)
            return 'This command requires some code.';
        /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
        const message = ctx.message;
        const client = ctx.client;
        const event = ctx.event;
        const lastResult = this.lastResult;
        const callback = (val) => {
            if (val instanceof Error)
                ctx.reply(`Callback error: \`${val}\``);
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
        }
        catch (err) {
            return `Error while evaluating: \`${err}\``;
        }
        this.hrStart = process.hrtime();
        return this.makeResultMessages(this.lastResult, hrDiff, evalString);
    }
    makeResultMessages(result, hrDiff, input) {
        const inspected = util_1.default
            .inspect(result, { depth: 0 })
            .replace(nlPattern, '\n')
            .replace(this.sensitivePattern, '--snip--');
        if (input) {
            return (`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n\`\`\`js\n` +
                inspected.slice(0, 1900) +
                `\`\`\``);
        }
        else {
            return (`*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n\`\`\`js\n` +
                inspected.slice(0, 1900) +
                `\`\`\``);
        }
    }
    get sensitivePattern() {
        if (!this._sensitivePattern) {
            // @ts-ignore
            const token = this.client.bot._token;
            let pattern = '';
            if (token)
                pattern += util_2.escapeRegex(token);
            Object.defineProperty(this, '_sensitivePattern', {
                value: new RegExp(pattern, 'gi'),
                configurable: false
            });
        }
        return this._sensitivePattern;
    }
}
exports.default = EvalCommand;
