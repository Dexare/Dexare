import { exec } from 'child_process';
import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';

export default class ExecCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
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

  async run(ctx: CommandContext) {
    let execString: string = ctx.event
      .get('commands/strippedContent')
      .trim()
      .slice(ctx.event.get('commands/commandName') + 1);

    if (execString.startsWith('```') && execString.endsWith('```'))
      execString = execString.replace(/(^.*?\s)|(\n.*$)/g, '');

    if (!execString) return 'This command requires something to execute.';

    await this.client.startTyping(ctx.channel.id);
    const hrStart = process.hrtime();
    exec(execString, (err, stdout, stderr) => {
      this.client.stopTyping(ctx.channel.id);
      if (err) return ctx.send(`Error while executing: \`\`\`${err}\`\`\``);
      const hrDiff = process.hrtime(hrStart);
      ctx.send(
        `*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*\n` +
          (stderr ? `\`\`\`js${stderr}\`\`\`\n` : '') +
          `\`\`\`${stdout}\`\`\``
      );
    });
  }
}
