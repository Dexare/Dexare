import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';

export default class KillCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'kill',
      description: 'Disconnects the bot and kills the process.',
      category: 'Developer',
      userPermissions: ['dexare.elevated'],
      metadata: {
        examples: ['kill']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    await ctx.reply('Killing the bot...');
    await this.client.disconnect();
    process.exit(0);
  }
}
