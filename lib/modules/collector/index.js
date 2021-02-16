"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("@discordjs/collection"));
const module_1 = __importDefault(require("../../module"));
const message_1 = __importDefault(require("./message"));
/** The Dexare module for collecting objects. */
class CollectorModule extends module_1.default {
    constructor(client) {
        super(client, {
            name: 'collector',
            description: "Dexare's collection handler, for asynchronous object collection."
        });
        this.activeCollectors = new collection_1.default();
        this.filePath = __filename;
    }
    /**
     * Creates a message collector.
     * @param channel The channel to create the collector for
     * @param filter The filter to use against new messages
     * @param options The options for the collector.
     */
    createMessageCollector(channel, filter, options = {}) {
        return new message_1.default(this, channel, filter, options);
    }
    /** Awaits messages in a channel. */
    awaitMessages(channel, filter, options = {}) {
        return new Promise((resolve, reject) => {
            const collector = this.createMessageCollector(channel, filter, options);
            collector.once('end', (collection, reason) => {
                if (options.errors && options.errors.includes(reason)) {
                    reject(collection);
                }
                else {
                    resolve(collection);
                }
            });
        });
    }
}
exports.default = CollectorModule;
