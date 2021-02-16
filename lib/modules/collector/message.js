"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collector_1 = __importDefault(require("./collector"));
/**
 * Collects messages on a channel.
 * Will automatically stop if the channel (`'channelDelete'`) or guild (`'guildDelete'`) are deleted.
 */
class MessageCollector extends collector_1.default {
    constructor(collectorModule, channel, filter, options = {}) {
        super(collectorModule, filter, options);
        this.received = 0;
        this.channel = channel;
        this.registerEvent('messageCreate', this.handleCollect, {
            before: this.options.skip || []
        });
        this.registerEvent('messageDelete', this.handleDispose);
        this.registerEvent('messageDeleteBulk', (_, messages) => {
            for (const message of messages)
                this.handleDispose(message);
        });
        this.registerEvent('channelDelete', (_, channel) => {
            if (channel.id === this.channel.id)
                this.stop('channelDelete');
        });
        this.registerEvent('guildDelete', (_, guild) => {
            if ('guild' in this.channel && guild.id === this.channel.guild.id)
                this.stop('guildDelete');
        });
    }
    /**
     * Handles a message for possible collection.
     * @param message The message that could be collected
     */
    collect(event, message) {
        if (message.channel.id !== this.channel.id)
            return null;
        if (this.options.skip)
            this.options.skip.forEach((group) => event.skip(group));
        this.received++;
        return {
            key: message.id,
            value: message
        };
    }
    /**
     * Handles a message for possible disposal.
     * @param message The message that could be disposed of
     */
    dispose(_, message) {
        return message.channel.id === this.channel.id ? message.id : null;
    }
    /** Checks after un/collection to see if the collector is done. */
    endReason() {
        if (this.options.max && this.collected.size >= this.options.max)
            return 'limit';
        if (this.options.maxProcessed && this.received === this.options.maxProcessed)
            return 'processedLimit';
        return null;
    }
}
exports.default = MessageCollector;
