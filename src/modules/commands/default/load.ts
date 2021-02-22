import path from 'path';
import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';

export default class LoadCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'load',
      description: 'Loads modules.',
      category: 'Developer',
      userPermissions: ['dexare.elevated'],
      metadata: {
        examples: ['load ./path/to/module'],
        usage: '<path> [path] ...'
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args.length) return 'Please define module(s) you want to load.';

    const mods: any[] = [];

    for (const arg of ctx.args) {
      try {
        delete require.cache[require.resolve(path.join(process.cwd(), arg))];
        const mod = require(path.join(process.cwd(), arg));
        mods.push(mod);
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') return `A module could not be found in \`${arg}\`.`;
        return `Error loading module from \`${arg}\`: \`${e.toString()}\``;
      }
    }

    try {
      await this.client.loadModulesAsync(...mods);
      return `Loaded ${ctx.args.length.toLocaleString()} module(s).`;
    } catch (e) {
      return `Error loading modules: \`${e.toString()}\``;
    }
  }
}
