"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandContext {
    /**
     * @param creator The instantiating creator.
     * @param data The interaction data for the context.
     * @param respond The response function for the interaction.
     * @param webserverMode Whether the interaction was from a webserver.
     */
    constructor(cmdsModule, event, args, prefix, message) {
        this.cmdsModule = cmdsModule;
        this.client = cmdsModule.client;
        this.event = event;
        this.message = message;
        this.channel = message.channel;
        this.author = message.author;
        if (message.member)
            this.member = message.member;
        if ('guild' in message.channel)
            this.guild = message.channel.guild;
        this.args = args;
        this.prefix = prefix;
    }
    /** Shorthand for `message.channel.createMessage`. */
    send(content, file) {
        return this.message.channel.createMessage(content, file);
    }
    /**
     * Sends a message with the author's mention prepended to it.
     * Only prepends in guild channels.
     */
    reply(content, file) {
        if (typeof content === 'string')
            content = { content };
        // @ts-ignore
        content.message_reference = { message_id: this.message.id };
        // content.messageReferenceID = this.message.id;
        return this.message.channel.createMessage(content, file);
    }
    /**
     * Sends a message with the author's mention prepended to it.
     * Only prepends in guild channels.
     */
    replyMention(content, file) {
        if (typeof content === 'string')
            content = { content };
        if (content.content && this.guild)
            content.content = `${this.message.author.mention}, ${content.content}`;
        return this.message.channel.createMessage(content, file);
    }
}
exports.default = CommandContext;
