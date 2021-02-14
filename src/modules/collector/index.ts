import Collection from '@discordjs/collection';
import Eris from 'eris';
import DexareClient from '../../client';
import DexareModule from '../../module';
import Collector from './collector';
import MessageCollector, {
  MessageCollectorFilter,
  MessageCollectorOptions
} from './message';

export interface AwaitMessagesOptions extends MessageCollectorOptions {
  /** Stop/end reasons that cause the promise to reject */
  errors?: string[];
}

export default class CollectorModule<
  T extends DexareClient = DexareClient
> extends DexareModule<T> {
  readonly activeCollectors = new Collection<string, Collector>();

  constructor(client: T) {
    super(client, {
      name: 'collector'
    });
  }

  createMessageCollector(
    channel: Eris.TextableChannel,
    filter: MessageCollectorFilter,
    options: MessageCollectorOptions = {}
  ): MessageCollector {
    return new MessageCollector(this, channel, filter, options);
  }

  awaitMessages(
    channel: Eris.TextableChannel,
    filter: MessageCollectorFilter,
    options: AwaitMessagesOptions = {}
  ) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(channel, filter, options);
      collector.once('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }
}
