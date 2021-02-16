import Eris from 'eris';
import CollectorModule from '.';
import { DexareClient } from '../..';
import { ClientEvent } from '../../client/events';
import Collector, { CollectorOptions } from './collector';
export declare type MessageCollectorFilter = (message: Eris.Message) => boolean;
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
    readonly options: MessageCollectorOptions;
    received: number;
    constructor(collectorModule: CollectorModule<DexareClient<any>>, channel: Eris.TextableChannel, filter: MessageCollectorFilter, options?: MessageCollectorOptions);
    /**
     * Handles a message for possible collection.
     * @param message The message that could be collected
     */
    collect(event: ClientEvent, message: Eris.Message): {
        key: string;
        value: Eris.Message<Eris.TextableChannel>;
    } | null;
    /**
     * Handles a message for possible disposal.
     * @param message The message that could be disposed of
     */
    dispose(_: never, message: Eris.PossiblyUncachedMessage): string | null;
    /** Checks after un/collection to see if the collector is done. */
    endReason(): "limit" | "processedLimit" | null;
}
