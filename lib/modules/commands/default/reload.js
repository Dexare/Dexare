"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const command_1 = __importDefault(require("../command"));
class ReloadCommand extends command_1.default {
    constructor(client) {
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
    fileExists(path) {
        const stat = fs_1.default.lstatSync(path);
        return stat.isFile();
    }
    async run(ctx) {
        if (!ctx.args.length)
            return 'Please define module(s) you want to reload.';
        for (const arg of ctx.args) {
            if (!this.client.modules.has(arg))
                return `The module \`${arg}\` does not exist.`;
            const mod = this.client.modules.get(arg);
            if (!mod.filePath)
                return `The module \`${arg}\` does not have a file path defined.`;
            if (!this.fileExists(mod.filePath))
                return `The file for module \`${arg}\` no longer exists.`;
            await this.client.unloadModule(arg);
            delete require.cache[require.resolve(mod.filePath)];
            const newMod = require(mod.filePath);
            this.client.loadModules(newMod);
        }
        return `Reloaded ${ctx.args.length.toLocaleString()} module(s).`;
    }
}
exports.default = ReloadCommand;
