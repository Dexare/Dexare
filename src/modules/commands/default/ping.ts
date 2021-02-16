import { oneLine } from 'common-tags';
import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';

export class PingCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'ping',
      description: "Checks the bot's ping and latency.",
      category: 'General',
      metadata: {
        examples: ['ping']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    const currentPing = Array.from(this.client.bot.shards.values())
      .map((shard) => shard.latency)
      .reduce((prev, val) => prev + val, 0);
    const timeBeforeMessage = Date.now();
    const pingMsg = await ctx.reply('Pinging...');
    return pingMsg.edit(oneLine`
      ${ctx.member ? `${ctx.author.mention},` : ''}
      Pong! The message took ${(Date.now() - timeBeforeMessage).toLocaleString()}ms to be created.
      The heartbeat ping is ${Math.round(currentPing).toLocaleString()}ms.
    `);
  }
}
