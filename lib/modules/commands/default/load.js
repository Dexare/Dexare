"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const command_1 = __importDefault(require("../command"));
class LoadCommand extends command_1.default {
    constructor(client) {
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
    async run(ctx) {
        if (!ctx.args.length)
            return 'Please define module(s) you want to load.';
        const mods = [];
        for (const arg of ctx.args) {
            try {
                delete require.cache[require.resolve(path_1.default.join(process.cwd(), arg))];
                const mod = require(path_1.default.join(process.cwd(), arg));
                mods.push(mod);
            }
            catch (e) {
                if (e.code === 'MODULE_NOT_FOUND')
                    return `A module could not be found in \`${arg}\`.`;
                return `Error loading module from \`${arg}\`: \`${e.toString()}\``;
            }
        }
        try {
            this.client.loadModules(...mods);
            return `Loaded ${ctx.args.length.toLocaleString()} module(s).`;
        }
        catch (e) {
            return `Error loading modules: \`${e.toString()}\``;
        }
    }
}
exports.default = LoadCommand;
