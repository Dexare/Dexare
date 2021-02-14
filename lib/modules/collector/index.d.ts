import Collection from '@discordjs/collection';
import Eris from 'eris';
import DexareClient from '../../client';
import DexareModule from '../../module';
import Collector from './collector';
import MessageCollector, { MessageCollectorFilter, MessageCollectorOptions } from './message';
export interface AwaitMessagesOptions extends MessageCollectorOptions {
    /** Stop/end reasons that cause the promise to reject */
    errors?: string[];
}
export default class CollectorModule<T extends DexareClient = DexareClient> extends DexareModule<T> {
    readonly activeCollectors: Collection<string, Collector>;
    constructor(client: T);
    createMessageCollector(channel: Eris.TextableChannel, filter: MessageCollectorFilter, options?: MessageCollectorOptions): MessageCollector;
    awaitMessages(channel: Eris.TextableChannel, filter: MessageCollectorFilter, options?: AwaitMessagesOptions): Promise<unknown>;
}
