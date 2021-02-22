import fs from 'fs';
import DexareClient from '../../../client';
import DexareCommand from '../command';
import CommandContext from '../context';

export default class ReloadCommand extends DexareCommand {
  constructor(client: DexareClient<any>) {
    super(client, {
      name: 'reload',
      description: 'Reloads modules.',
      category: 'Developer',
      userPermissions: ['dexare.elevated'],
      metadata: {
        examples: ['reload moduleName'],
        usage: '<moduleName> [moduleName] ...'
      }
    });

    this.filePath = __filename;
  }

  fileExists(path: string) {
    const stat = fs.lstatSync(path);
    return stat.isFile();
  }

  async run(ctx: CommandContext) {
    if (!ctx.args.length) return 'Please define module(s) you want to reload.';

    for (const arg of ctx.args) {
      if (!this.client.modules.has(arg)) return `The module \`${arg}\` does not exist.`;
      const mod = this.client.modules.get(arg)!;
      if (!mod.filePath) return `The module \`${arg}\` does not have a file path defined.`;
      if (!this.fileExists(mod.filePath)) return `The file for module \`${arg}\` no longer exists.`;
      await this.client.unloadModule(arg);
      delete require.cache[require.resolve(mod.filePath)];
      const newMod = require(mod.filePath);
      this.client.loadModules(newMod);
    }

    return `Reloaded ${ctx.args.length.toLocaleString()} module(s).`;
  }
}
