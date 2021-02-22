"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../command"));
class UnloadCommand extends command_1.default {
    constructor(client) {
        super(client, {
            name: 'unload',
            description: 'Unloads modules.',
            category: 'Developer',
            userPermissions: ['dexare.elevated'],
            metadata: {
                examples: ['unload moduleName'],
                usage: '<moduleName> [moduleName] ...'
            }
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        if (!ctx.args.length)
            return 'Please define module(s) you want to unload.';
        for (const arg of ctx.args) {
            if (!this.client.modules.has(arg))
                return `The module \`${arg}\` does not exist.`;
            await this.client.unloadModule(arg);
        }
        return `Unloaded ${ctx.args.length.toLocaleString()} module(s).`;
    }
}
exports.default = UnloadCommand;
