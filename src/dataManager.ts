/* eslint-disable @typescript-eslint/no-unused-vars */
import DexareClient from './client';
import { ClientEvent } from './client/events';
import { ThrottlingOptions } from './modules/commands/command';
import LoggerHandler from './util/logger';

/** Options for the {@link DataManager}. */
export interface DataManagerOptions {
  /** The name of the manager. */
  name: string;
  /** The description of the manager. */
  description?: string;
}

/** The throttle result of {@link DataManager#throttleCommand} */
export interface ThrottleResult {
  okay: boolean;
  reset?: number;
  usesLeft?: number;
}

/** @private */
export interface ThrottleObject {
  reset: number;
  uses: number;
}

/** A data manager for Dexare. */
export default class DataManager {
  /** The options for this manager. */
  readonly options: DataManagerOptions;
  /** The logger for the manager. */
  readonly logger: LoggerHandler<DexareClient<any>>;
  /** The Dexare client for this manager. */
  readonly client: DexareClient<any>;
  /**
   * The file path of the manager.
   * Set this to `__filename` in the constructor.
   */
  filePath?: string;

  constructor(client: DexareClient<any>, options: DataManagerOptions) {
    this.options = options;
    this.client = client;
    this.logger = new LoggerHandler<DexareClient<any>>(this.client, this.options.name);
  }

  /** Fired when the manager is signaled to start. */
  async start() {}

  /** Fired when the manager is signaled to stop. */
  async stop() {}

  /**
   * Gets the throttle result from an ID and scope.
   * @param scope The scope of the throttles
   * @param id The ID of the throttle
   * @returns The Throttle result, if any
   */
  async getThrottle(scope: string, id: string): Promise<ThrottleObject | void> {
    return;
  }

  /**
   * Sets the throttle result to an ID and scope.
   * @param scope The scope of the throttles
   * @param id The ID of the throttle
   * @param object The throttle to set
   */
  async setThrottle(scope: string, id: string, object: ThrottleObject): Promise<void> {
    return;
  }

  /**
   * Removes a throttle object.
   * @param scope The scope of the throttles
   * @param id The ID of the throttle
   */
  async removeThrottle(scope: string, id: string): Promise<void> {
    return;
  }

  /**
   * Throttles something.
   * @param scope The group to put the throttle in
   * @param opts The throttling options to use
   * @param id The identifier of the throttle
   * @param event The event to use
   */
  async throttle(
    scope: string,
    opts: ThrottlingOptions,
    id: string,
    event?: ClientEvent
  ): Promise<ThrottleResult> {
    let throttle = await this.getThrottle(scope, id);
    if (!throttle || throttle.reset < Date.now()) {
      throttle = {
        reset: Date.now() + opts.duration * 1000,
        uses: opts.usages
      };
    }

    const okay = throttle.uses > 0;
    if (okay) {
      throttle.uses--;
      await this.setThrottle(scope, id, throttle);
    }

    return {
      okay,
      reset: throttle.reset,
      usesLeft: throttle.uses
    };
  }
}
