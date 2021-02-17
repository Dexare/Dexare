"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const command_1 = __importDefault(require("../command"));
class ExecCommand extends command_1.default {
    constructor(client) {
        super(client, {
            name: 'exec',
            description: 'Executes terminal commands with child_process.exec.',
            category: 'Developer',
            userPermissions: ['dexare.elevated'],
            metadata: {
                examples: ['exec echo hi'],
                usage: '<command>'
            }
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        let execString = ctx.event
            .get('commands/strippedContent')
            .trim()
            .slice(ctx.event.get('commands/commandName') + 1);
        if (execString.startsWith('```') && execString.endsWith('```'))
            execString = execString.replace(/(^.*?\s)|(\n.*$)/g, '');
        if (!execString)
            return 'This command requires something to execute.';
        await this.client.startTyping(ctx.channel.id);
        const hrStart = process.hrtime();
        child_process_1.exec(execString, (err, stdout, stderr) => {
            this.client.stopTyping(ctx.channel.id);
            if (err)
                return ctx.send(`Error while executing: \`\`\`${err}\`\`\``);
            const hrDiff = process.hrtime(hrStart);
            ctx.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n` +
                (stderr ? `\`\`\`js${stderr}\`\`\`\n` : '') +
                `\`\`\`${stdout}\`\`\``);
        });
    }
}
exports.default = ExecCommand;
