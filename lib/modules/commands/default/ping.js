"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const command_1 = __importDefault(require("../command"));
class PingCommand extends command_1.default {
    constructor(client) {
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
    async run(ctx) {
        const currentPing = Array.from(this.client.bot.shards.values())
            .map((shard) => shard.latency)
            .reduce((prev, val) => prev + val, 0);
        const timeBeforeMessage = Date.now();
        const pingMsg = await ctx.reply('Pinging...');
        return pingMsg.edit(common_tags_1.oneLine `
      Pong! The message took ${(Date.now() - timeBeforeMessage).toLocaleString()}ms to be created.
      The heartbeat ping is ${Math.round(currentPing).toLocaleString()}ms.
    `);
    }
}
exports.default = PingCommand;
