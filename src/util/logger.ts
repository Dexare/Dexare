import DexareClient from '../client';
import { LoggerExtra } from '../types';

/** A helper for modules to log events to Dexare */
export default class LoggerHandler<T extends DexareClient<any>> {
  private readonly client: T;
  private readonly module: string;

  constructor(client: T, moduleName: string) {
    this.client = client;
    this.module = moduleName;
  }

  /**
   * Logs to Dexare on the `debug` level.
   * @param args The arguments to log
   */
  debug(...args: any[]) {
    return this.send('debug', args);
  }

  /**
   * Logs to Dexare on the `debug` level.
   * @param args The arguments to log
   */
  log(...args: any[]) {
    return this.send('debug', args);
  }

  /**
   * Logs to Dexare on the `info` level.
   * @param args The arguments to log
   */
  info(...args: any[]) {
    return this.send('info', args);
  }

  /**
   * Logs to Dexare on the `warn` level.
   * @param args The arguments to log
   */
  warn(...args: any[]) {
    return this.send('warn', args);
  }

  /**
   * Logs to Dexare on the `error` level.
   * @param args The arguments to log
   */
  error(...args: any[]) {
    return this.send('error', args);
  }

  /**
   * Logs to Dexare.
   * @param level The level to log to
   * @param args The arguments to log
   * @param extra The extra variables to log with
   */
  send(level: string, args: any[], extra?: LoggerExtra) {
    return this.client.emit('logger', level, this.module, args, extra);
  }
}
