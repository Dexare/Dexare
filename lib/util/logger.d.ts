import DexareClient from '../client';
import { LoggerExtra } from '../types';
/** A helper for modules to log events to Dexare */
export default class LoggerHandler<T extends DexareClient<any>> {
    private readonly client;
    private readonly module;
    constructor(client: T, moduleName: string);
    /**
     * Logs to Dexare on the `debug` level.
     * @param args The arguments to log
     */
    debug(...args: any[]): boolean;
    /**
     * Logs to Dexare on the `debug` level.
     * @param args The arguments to log
     */
    log(...args: any[]): boolean;
    /**
     * Logs to Dexare on the `info` level.
     * @param args The arguments to log
     */
    info(...args: any[]): boolean;
    /**
     * Logs to Dexare on the `warn` level.
     * @param args The arguments to log
     */
    warn(...args: any[]): boolean;
    /**
     * Logs to Dexare on the `error` level.
     * @param args The arguments to log
     */
    error(...args: any[]): boolean;
    /**
     * Logs to Dexare.
     * @param level The level to log to
     * @param args The arguments to log
     * @param extra The extra variables to log with
     */
    send(level: string, args: any[], extra?: LoggerExtra): boolean;
}
