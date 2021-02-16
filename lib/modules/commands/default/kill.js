"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../command"));
class KillCommand extends command_1.default {
    constructor(client) {
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
    async run(ctx) {
        await ctx.reply('Killing the bot...');
        await this.client.disconnect();
        process.exit(0);
    }
}
exports.default = KillCommand;
