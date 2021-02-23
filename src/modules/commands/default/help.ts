import { oneLine, stripIndents } from 'common-tags';
import Eris from 'eris';
import { chunk } from 'lodash';
import DexareClient from '../../../client';
import { keyValueForEach, truncate } from '../../../util';
import DexareCommand from '../command';
import CommandContext from '../context';

export default class HelpCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'help',
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      category: 'General',
      metadata: {
        examples: ['help', 'help ping'],
        usage: '[command]',
        details: oneLine`
          The command may be part of a command name or a whole command name.
          If it isn't specified, all available commands will be listed.
        `
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    const prefix = ctx.prefix + (ctx.event.get('commands/spacedPrefix') ? ' ' : '');

    if (ctx.args.length) {
      const commands = ctx.cmdsModule.find(ctx.args[0], ctx);
      if (!commands.length) return `I couldn't find any commands with \`${ctx.args[0]}\`!`;
      else {
        const command = commands[0];
        const embed: Eris.EmbedOptions = {
          title: `${prefix}${command.name}`,
          color: 0x7289da,
          fields: [],
          description: command.description
        };
        let text = stripIndents`
          __Command **${command.name}**:__ ${command.description || ''}
					**Category:** ${command.category}
        `;

        // Aliases
        if (command.aliases.length !== 0) {
          text += `\n**Aliases:** ${command.aliases.join(', ')}`;
          embed.fields!.push({
            name: 'Aliases',
            value: command.aliases.map((a) => `\`${a}\``).join(', '),
            inline: true
          });
        }

        // Details
        if (command.metadata?.details) {
          text += `\n**Details:** ${command.metadata.details}`;
          embed.fields!.push({
            name: 'Details',
            value: command.metadata.details
          });
        }

        // Usage
        if (command.metadata?.usage) {
          text += `\n**Usage:** ${command.metadata.usage}`;
          embed.fields!.push({
            name: 'Usage',
            value: command.metadata.usage
          });
        }

        // Examples
        if (command.metadata?.examples.length !== 0) {
          text += `\n**Examples:**\n${command.metadata.examples.join('\n')}`;
          embed.fields!.push({
            name: 'Examples',
            value: command.metadata.examples.map((a: string) => `${prefix}${a}`).join('\n'),
            inline: true
          });
        }

        const canSendEmbed =
          'permissionsOf' in ctx.channel
            ? ctx.channel.permissionsOf(this.client.bot.user.id).has('embedLinks')
            : true;
        return canSendEmbed
          ? { embed }
          : {
              content: text,
              allowedMentions: {
                repliedUser: true,
                users: false,
                roles: false,
                everyone: false
              }
            };
      }
    }

    // Display general help command
    const embed: Eris.EmbedOptions = {
      color: 0x7289da,
      footer: {
        text: `Run "${prefix}help <command>" for more info on a command.`
      },
      fields: []
    };

    const embeds: Eris.EmbedOptions[] = [];

    // Populate categories
    const categories: { [cat: string]: string[] } = {};
    this.client.commands.commands.forEach((command) => {
      if (typeof command.hasPermission(ctx, ctx.event) === 'string') return;
      const commandName = command.name;
      const category = command.category || 'Uncategorized';
      if (categories[category]) categories[category].push(commandName);
      else categories[category] = [commandName];
    });

    // List categories into fields
    keyValueForEach(categories, (cat, cmdNames) => {
      let cmds: string[] = [];
      let valueLength = 0;
      let fieldsPushed = 0;
      cmdNames.forEach((name: string) => {
        const length = name.length + 4;
        if (valueLength + length > 1024) {
          fieldsPushed++;
          embed.fields!.push({
            name: `${truncate(cat, 200)} (${fieldsPushed})`,
            value: cmds.join(', ')
          });
          valueLength = 0;
          cmds = [];
        }

        cmds.push(`\`${name}\``);
        valueLength += length;
      });

      embed.fields!.push({
        name: fieldsPushed ? `${truncate(cat, 200)} (${fieldsPushed + 1})` : truncate(cat, 256),
        value: cmds.join(', ')
      });
    });

    // Chunk fields
    const chunkedFields = chunk(embed.fields!, 4);
    chunkedFields.forEach((chunk, i) =>
      embeds.push({
        ...embed,
        title: `Commands in ${ctx.guild ? truncate(ctx.guild.name, 100) : 'all servers'}${
          chunkedFields.length == 1 ? '' : ` (${i + 1})`
        }`,
        fields: chunk
      })
    );

    if (embeds.length === 1) return { embed: embeds[0] };
    try {
      const dm = await ctx.author.getDMChannel();
      for (const chunkedEmbed of embeds) await dm.createMessage({ embed: chunkedEmbed });
      if (ctx.guild) return 'Sent you a DM with information.';
    } catch (e) {
      return 'Unable to send you the help DM. You probably have DMs disabled.';
    }
  }
}
