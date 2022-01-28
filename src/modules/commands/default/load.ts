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
        examples: ['load ./path/to/module', 'load ~@dexare/logger'],
        usage: '<path> [path] ...',
        details: 'You can prefix a path name with `~` to load from a package.'
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args.length) return 'Please define module(s) you want to load.';

    const mods: any[] = [];

    for (const arg of ctx.args) {
      try {
        let requirePath: string;
        if (arg.startsWith('~')) {
          requirePath = arg.slice(1);
        } else {
          requirePath = path.join(process.cwd(), arg);
        }
        delete require.cache[require.resolve(requirePath)];
        const mod = require(requirePath);
        mods.push(mod);
      } catch (e) {
        if ((e as any)?.code === 'MODULE_NOT_FOUND') return `A module could not be found in \`${arg}\`.`;
        return `Error loading module from \`${arg}\`: \`${String(e)}\``;
      }
    }

    try {
      await this.client.loadModulesAsync(...mods);
      return `Loaded ${ctx.args.length.toLocaleString()} module(s).`;
    } catch (e) {
      return `Error loading modules: \`${String(e)}\``;
    }
  }
}
