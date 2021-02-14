import DexareClient, { DexareEvents } from './client';
import { EventHandlers } from './client/events';
import LoggerHandler from './util/logger';

export interface ModuleOptions {
  name: string;
  requires?: string[];
}

export default class DexareModule<T extends DexareClient<any>> {
  readonly options: ModuleOptions;
  readonly registerQueue: [
    { event: keyof DexareEvents; before?: string[]; after?: string[] },
    EventHandlers[keyof DexareEvents]
  ][] = [];
  readonly logger: LoggerHandler<T>;
  readonly client: T;
  loaded = false;

  constructor(client: T, options: ModuleOptions) {
    this.options = options;
    this.client = client;
    this.logger = new LoggerHandler<T>(this.client, this.options.name);
  }

  /** @hidden */
  _load() {
    this.loaded = true;
    this.registerQueue.forEach(([{ event, before, after }, handler]) =>
      this.registerEvent(event, handler, { before, after })
    );
    this.registerQueue.length = 0;
    this.load();
  }

  /** Fired when this module is loaded. */
  load() {}

  /** Fired when this module is being unloaded. */
  unload() {}

  registerEvent<E extends keyof DexareEvents>(
    event: E,
    handler: EventHandlers[E],
    options?: { before?: string[]; after?: string[] }
  ) {
    return this.client.events.register(
      this.options.name,
      event,
      handler,
      options
    );
  }

  unregisterEvent(event: keyof DexareEvents) {
    return this.client.events.unregister(this.options.name, event);
  }

  unregisterAllEvents() {
    return this.client.events.unregisterGroup(this.options.name);
  }
}
