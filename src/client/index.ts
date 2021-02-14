import Collection from '@discordjs/collection';
import Eris from 'eris';
import EventEmitter from 'eventemitter3';
import { ErisEventNames } from '../constants';
import DexareModule from '../module';
import CommandsModule from '../modules/commands';
import CollectorModule from '../modules/commands';
import { ErisEvents, LoggerExtra } from '../types';
import LoggerHandler from '../util/logger';
import TypedEmitter from '../util/typedEmitter';
import EventRegistry from './events';
import PermissionRegistry from './permissions';

export interface BaseConfig {
  token: string;
  erisOptions?: Eris.ClientOptions;
  elevated?: string | Array<string>;
}

/**
 * The events typings for the {@link DexareClient}.
 * @private
 */
export interface DexareClientEvents extends ErisEvents {
  logger(level: string, group: string, args: any[], extra?: LoggerExtra): void;
}

/** @hidden */
export type DexareEvents = DexareClientEvents & {
  [event: string]: (...args: any[]) => void;
};

export default class DexareClient<
  T extends BaseConfig = BaseConfig
> extends ((EventEmitter as any) as new () => TypedEmitter<DexareEvents>) {
  config: T;
  readonly bot: Eris.Client;
  readonly permissions: PermissionRegistry<this>;
  readonly events = new EventRegistry<this>(this);
  readonly logger = new LoggerHandler<this>(this, 'dexare/client');
  readonly modules = new Collection<string, DexareModule<this>>();
  readonly commands = new CommandsModule<this>(this);
  readonly collector = new CollectorModule<this>(this);
  // eslint-disable-next-line no-undef
  private readonly _typingIntervals = new Map<string, NodeJS.Timeout>();
  private readonly _hookedEvents: string[] = [];

  constructor(config: T) {
    // eslint-disable-next-line constructor-super
    super();

    this.config = config;
    this.bot = new Eris.Client(this.config.token, this.config.erisOptions);
    this.permissions = new PermissionRegistry(this);
    this.modules.set('commands', this.commands);
    this.commands._load();
    this.modules.set('collector', this.collector);
  }

  loadModules(...moduleObjects: any[]) {
    const modules = moduleObjects.map(this._resolveModule);
    const loadOrder = this._getLoadOrder(modules);

    for (const modName of loadOrder) {
      const mod = modules.find((mod) => mod.options.name === modName)!;
      this.modules.set(modName, mod);
      mod._load();
    }

    return this;
  }

  /**
   * Log events to console.
   * @param logLevel The level to log at.
   * @param excludeModules The modules to exclude
   * @param includeErisEvents Whether to log eris debug/warn/error events.
   */
  logToConsole(
    logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info',
    includeErisEvents = true,
    excludeModules: string[] = []
  ) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const index = levels.indexOf(logLevel);
    this.on('logger', (level, moduleName, args) => {
      let importance = levels.indexOf(level);
      if (importance === -1) importance = 0;
      if (importance < index) return;

      if (excludeModules.includes(moduleName)) return;

      let logFunc = console.debug;
      if (level === 'info') logFunc = console.info;
      else if (level === 'error') logFunc = console.error;
      else if (level === 'warn') logFunc = console.warn;
      logFunc(level.toUpperCase(), `[${moduleName}]`, ...args);
    });

    if (includeErisEvents) {
      this.on('debug', (message, id) =>
        this.emit('logger', 'debug', 'eris', [message], { id })
      );
      this.on('warn', (message, id) =>
        this.emit('logger', 'warn', 'eris', [message], { id })
      );
      this.on('error', (error, id) =>
        this.emit('logger', 'warn', 'eris', [error], { id })
      );
    }

    return this;
  }

  on<E extends keyof DexareEvents>(event: E, listener: DexareEvents[E]) {
    if (
      typeof event === 'string' &&
      !this._hookedEvents.includes(event) &&
      ErisEventNames.includes(event)
    ) {
      this.bot.on(event, (...args: any[]) => this.emit(event, ...args));
      this._hookedEvents.push(event);
    }

    return super.on(event, listener);
  }

  /**
   * Creates a promise that resolves on the next event
   * @param event The event to wait for
   */
  waitTill(event: keyof DexareEvents) {
    return new Promise((resolve) => this.once(event, resolve));
  }

  connect() {
    return this.bot.connect();
  }

  disconnect(reconnect: boolean | 'auto' = false) {
    return this.bot.disconnect({ reconnect });
  }

  /**
   * Start typing in a channel
   * @param channelID The channel's ID to start typing in
   */
  async startTyping(channelID: string) {
    if (this.isTyping(channelID)) return;
    await this.bot.sendChannelTyping(channelID);
    this._typingIntervals.set(
      channelID,
      setInterval(() => {
        this.bot
          .sendChannelTyping(channelID)
          .catch(() => this.stopTyping(channelID));
      }, 5000)
    );
  }

  /**
   * Whether the bot is currently typing in a channel.
   * @param channelID The channel ID to check for
   */
  isTyping(channelID: string) {
    return this._typingIntervals.has(channelID);
  }

  /**
   * Stops typing in a channel.
   * @param channelID The channel's ID to stop typing in
   */
  stopTyping(channelID: string) {
    if (!this.isTyping(channelID)) return;
    const interval = this._typingIntervals.get(channelID)!;
    clearInterval(interval);
    this._typingIntervals.delete(channelID);
  }

  private _resolveModule(moduleObject: any) {
    if (typeof moduleObject === 'function')
      moduleObject = new moduleObject(this);
    else if (typeof moduleObject.default === 'function')
      moduleObject = new moduleObject.default(this);

    if (!(moduleObject instanceof DexareModule))
      throw new Error(`Invalid module object to load: ${moduleObject}`);
    return moduleObject;
  }

  private _getLoadOrder(modules: DexareModule<any>[]) {
    const loadOrder: string[] = [];

    function insert(mod: DexareModule<any>) {
      if (mod.options.requires && mod.options.requires.length)
        mod.options.requires.forEach((modName) => {
          const dep = modules.find((mod) => mod.options.name === modName);
          if (!dep)
            throw new Error(
              `Module '${mod.options.name}' requires dependency '${modName}' which does not exist!`
            );
          insert(dep);
        });
      if (!loadOrder.includes(mod.options.name))
        loadOrder.push(mod.options.name);
    }

    modules.forEach((mod) => insert(mod));

    return loadOrder;
  }
}
