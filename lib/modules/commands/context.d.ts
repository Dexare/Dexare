import Eris from 'eris';
import CommandsModule from '.';
import DexareClient from '../../client';
import { ClientEvent } from '../../client/events';
export default class CommandContext {
    /** The commands module. */
    readonly cmdsModule: CommandsModule<DexareClient<any>>;
    /** The event that created this context. */
    readonly event: ClientEvent;
    /** The client from this context. */
    readonly client: DexareClient<any>;
    /** The message this context is reffering to. */
    readonly message: Eris.Message;
    /** The channel that the message is in. */
    readonly channel: Eris.TextableChannel;
    /** The author of the message. */
    readonly author: Eris.User;
    /** The prefix used for this context. */
    readonly prefix: string;
    /** The arguments used in this context. */
    readonly args: string[];
    /** The guild the message is in. */
    readonly guild?: Eris.Guild;
    /** The member that created the message. */
    member?: Eris.Member;
    /**
     * @param creator The instantiating creator.
     * @param data The interaction data for the context.
     * @param respond The response function for the interaction.
     * @param webserverMode Whether the interaction was from a webserver.
     */
    constructor(cmdsModule: CommandsModule<any>, event: ClientEvent, args: string[], prefix: string, message: Eris.Message);
    /** Shorthand for `message.channel.createMessage`. */
    send(content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[]): Promise<Eris.Message<Eris.TextableChannel>>;
    /** Sends a message with the author's mention prepended to it. */
    reply(content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[]): Promise<Eris.Message<Eris.TextableChannel>>;
}
