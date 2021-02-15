import Collection from '@discordjs/collection';
import EventEmitter from 'eventemitter3';
import CollectorModule from '.';
import DexareClient, { DexareEvents } from '../../client';
import { EventHandlers } from '../../client/events';
import TypedEmitter from '../../util/typedEmitter';

/** @hidden */
export type CollectorEvents = {
  collect: (...args: any[]) => void;
  dispose: (...args: any[]) => void;
  end: (collected: Collection<any, any>, reason: string) => void;
};

/** @hidden */
export type CollectorFilter = (...args: any[]) => boolean | Promise<boolean>;

/** The options for a {@link Collector}. */
export interface CollectorOptions {
  /** How long to run the collector for in milliseconds */
  time?: number;
  /** How long to stop the collector after inactivity in milliseconds */
  idle?: number;
  /** Whether to dispose data when it's deleted */
  dispose?: boolean;
}

/** The options for {@link Collector#resetTimer}. */
export interface ResetTimerOptions {
  /** How long to run the collector for in milliseconds */
  time?: number;
  /** How long to stop the collector after inactivity in milliseconds */
  idle?: number;
}

/** Class for defining a collector. */
export default class Collector extends ((EventEmitter as any) as new () => TypedEmitter<CollectorEvents>) {
  readonly module: CollectorModule;
  readonly client: DexareClient;

  /** The filter applied to this collector */
  readonly filter: CollectorFilter;
  /** The options of this collector */
  readonly options: CollectorOptions;
  /** The items collected by this collector */
  readonly collected = new Collection<any, any>();
  /** Whether this collector has finished collecting */
  ended = false;

  // eslint-disable-next-line no-undef
  private _timeout: NodeJS.Timeout | null = null;
  // eslint-disable-next-line no-undef
  private _idletimeout: NodeJS.Timeout | null = null;

  readonly id: string;

  constructor(
    collectorModule: CollectorModule,
    filter: CollectorFilter,
    options: CollectorOptions = {}
  ) {
    // eslint-disable-next-line constructor-super
    super();
    this.module = collectorModule;
    this.client = collectorModule.client;
    this.filter = filter;
    this.options = options;
    this.id = (Date.now() + Math.round(Math.random() * 1000)).toString(36);

    if (typeof filter !== 'function') throw new TypeError('INVALID_TYPE');

    this.handleCollect = this.handleCollect.bind(this);
    this.handleDispose = this.handleDispose.bind(this);

    if (options.time)
      this._timeout = setTimeout(() => this.stop('time'), options.time);
    if (options.idle)
      this._idletimeout = setTimeout(() => this.stop('idle'), options.idle);

    this.module.activeCollectors.set(this.id, this);
  }

  registerEvent<E extends keyof DexareEvents>(
    event: E,
    handler: EventHandlers[E],
    options?: { before?: string[]; after?: string[] }
  ) {
    return this.client.events.register(
      'collector:' + this.id,
      event,
      handler,
      options
    );
  }

  /**
   * Call this to handle an event as a collectable element. Accepts any event data as parameters.
   * @param args The arguments emitted by the listener
   */
  async handleCollect(...args: any[]) {
    const collect = this.collect(...args);

    if (collect && (await this.filter(...args, this.collected))) {
      this.collected.set(collect.key, collect.value);
      this.emit('collect', ...args);

      if (this._idletimeout) {
        clearTimeout(this._idletimeout);
        this._idletimeout = setTimeout(
          () => this.stop('idle'),
          this.options.idle!
        );
      }
    }
    this.checkEnd();
  }

  /**
   * Call this to remove an element from the collection. Accepts any event data as parameters.
   * @param args The arguments emitted by the listener
   */
  handleDispose(...args: any[]) {
    if (!this.options.dispose) return;

    const dispose = this.dispose(...args);
    // deepscan-disable-next-line CONSTANT_CONDITION
    if (!dispose || !this.filter(...args) || !this.collected.has(dispose))
      return;
    this.collected.delete(dispose);

    this.emit('dispose', ...args);
    this.checkEnd();
  }

  /**
   * Returns a promise that resolves with the next collected element;
   * rejects with collected elements if the collector finishes without receiving a next element
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('collect', onCollect);
        this.removeListener('end', onEnd);
      };

      const onCollect = (item: any) => {
        cleanup();
        resolve(item);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on('collect', onCollect);
      this.on('end', onEnd);
    });
  }

  /**
   * Stops this collector and emits the `end` event.
   * @param reason the reason this collector is ending
   */
  stop(reason = 'user') {
    if (this.ended) return;

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = null;
    }
    this.ended = true;

    this.client.events.unregisterGroup('collector:' + this.id);
    this.module.activeCollectors.delete(this.id);
    this.emit('end', this.collected, reason);
  }

  /**
   * Resets the collectors timeout and idle timer.
   * @param {Object} [options] Options
   * @param {number} [options.time] How long to run the collector for in milliseconds
   * @param {number} [options.idle] How long to stop the collector after inactivity in milliseconds
   */
  resetTimer(options: ResetTimerOptions = {}) {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(
        () => this.stop('time'),
        (options && options.time) || this.options.time!
      );
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = setTimeout(
        () => this.stop('idle'),
        (options && options.idle) || this.options.idle!
      );
    }
  }

  /** Checks whether the collector should end, and if so, ends it. */
  checkEnd() {
    const reason = this.endReason();
    if (reason) this.stop(reason);
  }

  /**
   * Allows collectors to be consumed with for-await-of loops
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
   */
  async *[Symbol.asyncIterator]() {
    const queue: any[] = [];
    const onCollect = (item: any) => queue.push(item);
    this.on('collect', onCollect);

    try {
      while (queue.length || !this.ended) {
        if (queue.length) {
          yield queue.shift();
        } else {
          await new Promise<void>((resolve) => {
            const tick = () => {
              this.removeListener('collect', tick);
              this.removeListener('end', tick);
              return resolve();
            };
            this.on('collect', tick);
            this.on('end', tick);
          });
        }
      }
    } finally {
      this.removeListener('collect', onCollect);
    }
  }

  /* eslint-disable no-empty-function, @typescript-eslint/no-unused-vars */
  /**
   * Handles incoming events from the `handleCollect` function. Returns null if the event should not
   * be collected, or returns an object describing the data that should be stored.
   * @see Collector#handleCollect
   * @param args Any args the event listener emits
   * @returns Data to insert into collection, if any
   */
  collect(...args: any[]): { key: any; value: any } | void | null {}

  /**
   * Handles incoming events from the `handleDispose`. Returns null if the event should not
   * be disposed, or returns the key that should be removed.
   * @see Collector#handleDispose
   * @param args Any args the event listener emits
   * @returns Key to remove from the collection, if any
   */
  dispose(...args: any[]): any {}

  /** The reason this collector has ended or will end with. */
  endReason(): string | void | null {}
}
