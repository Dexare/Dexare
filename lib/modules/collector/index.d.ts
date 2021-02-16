import Collection from '@discordjs/collection';
import Eris from 'eris';
import DexareClient from '../../client';
import DexareModule from '../../module';
import Collector from './collector';
import MessageCollector, { MessageCollectorFilter, MessageCollectorOptions } from './message';
/** The options for {@link CollectorModule#awaitMessages}. */
export interface AwaitMessagesOptions extends MessageCollectorOptions {
    /** Stop/end reasons that cause the promise to reject */
    errors?: string[];
}
/** The Dexare module for collecting objects. */
export default class CollectorModule<T extends DexareClient<any>> extends DexareModule<T> {
    readonly activeCollectors: Collection<string, Collector>;
    constructor(client: T);
    /**
     * Creates a message collector.
     * @param channel The channel to create the collector for
     * @param filter The filter to use against new messages
     * @param options The options for the collector.
     */
    createMessageCollector(channel: Eris.TextableChannel, filter: MessageCollectorFilter, options?: MessageCollectorOptions): MessageCollector;
    /** Awaits messages in a channel. */
    awaitMessages(channel: Eris.TextableChannel, filter: MessageCollectorFilter, options?: AwaitMessagesOptions): Promise<unknown>;
}
