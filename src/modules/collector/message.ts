import Eris from 'eris';
import CollectorModule from '.';
import { DexareClient } from '../..';
import { ClientEvent } from '../../client/events';
import Collector, { CollectorOptions } from './collector';

export type MessageCollectorFilter = (message: Eris.Message) => boolean;

export interface MessageCollectorOptions extends CollectorOptions {
  /** The maximum amount of messages to collect */
  max?: number;
  /** The maximum amount of messages to process */
  maxProcessed?: number;
  /** The event groups to skip over while collecting */
  skip?: string[];
}

/**
 * Collects messages on a channel.
 * Will automatically stop if the channel (`'channelDelete'`) or guild (`'guildDelete'`) are deleted.
 */
export default class MessageCollector extends Collector {
  readonly channel: Eris.TextableChannel;
  readonly options!: MessageCollectorOptions;
  received = 0;
  constructor(
    collectorModule: CollectorModule<DexareClient<any>>,
    channel: Eris.TextableChannel,
    filter: MessageCollectorFilter,
    options: MessageCollectorOptions = {}
  ) {
    super(collectorModule, filter, options);
    this.channel = channel;

    this.registerEvent('messageCreate', this.handleCollect, {
      before: this.options.skip || []
    });
    this.registerEvent('messageDelete', this.handleDispose);
    this.registerEvent('messageDeleteBulk', (_, messages) => {
      for (const message of messages) this.handleDispose(message);
    });
    this.registerEvent('channelDelete', (_, channel) => {
      if (channel.id === this.channel.id) this.stop('channelDelete');
    });
    this.registerEvent('guildDelete', (_, guild) => {
      if ('guild' in this.channel && guild.id === this.channel.guild.id) this.stop('guildDelete');
    });
  }

  /**
   * Handles a message for possible collection.
   * @param message The message that could be collected
   */
  collect(event: ClientEvent, message: Eris.Message) {
    if (message.channel.id !== this.channel.id) return null;
    if (this.options.skip) this.options.skip.forEach((group) => event.skip(group));
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
  dispose(_: never, message: Eris.PossiblyUncachedMessage) {
    return message.channel.id === this.channel.id ? message.id : null;
  }

  /** Checks after un/collection to see if the collector is done. */
  endReason() {
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }
}
