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
  constructor(
    cmdsModule: CommandsModule<any>,
    event: ClientEvent,
    args: string[],
    prefix: string,
    message: Eris.Message
  ) {
    this.cmdsModule = cmdsModule;
    this.client = cmdsModule.client;
    this.event = event;
    this.message = message;
    this.channel = message.channel;
    this.author = message.author;
    if (message.member) this.member = message.member;
    if ('guild' in message.channel) this.guild = message.channel.guild;
    this.args = args;
    this.prefix = prefix;
  }

  /** Shorthand for `message.channel.createMessage`. */
  send(content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[]) {
    return this.message.channel.createMessage(content, file);
  }

  /**
   * Sends a message with the author's mention prepended to it.
   * Only prepends in guild channels.
   */
  reply(content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[]) {
    if (typeof content === 'string') content = { content };
    // @ts-ignore
    content.message_reference = { message_id: this.message.id };
    // content.messageReferenceID = this.message.id;
    return this.message.channel.createMessage(content, file);
  }

  /**
   * Sends a message with the author's mention prepended to it.
   * Only prepends in guild channels.
   */
  replyMention(content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[]) {
    if (typeof content === 'string') content = { content };
    if (content.content && this.guild) content.content = `${this.message.author.mention}, ${content.content}`;
    return this.message.channel.createMessage(content, file);
  }

  /**

  // This won't work properly without guildMembers intent,
  // wait till next Eris patch
  async fetchMember() {
    if (this.member) return this.member;
    if (!this.guild) return null;
    const member = (await this.guild.fetchMembers({
      userIDs: [this.author.id]
    }))![0];
    this.guild!.members.set(this.author.id, member);
    this.member = member;
    return member;
  }

  **/
}
