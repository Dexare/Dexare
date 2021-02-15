"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** A helper for modules to log events to Dexare */
class LoggerHandler {
    constructor(client, moduleName) {
        this.client = client;
        this.module = moduleName;
    }
    /**
     * Logs to Dexare on the `debug` level.
     * @param args The arguments to log
     */
    debug(...args) {
        return this.send('debug', args);
    }
    /**
     * Logs to Dexare on the `debug` level.
     * @param args The arguments to log
     */
    log(...args) {
        return this.send('debug', args);
    }
    /**
     * Logs to Dexare on the `info` level.
     * @param args The arguments to log
     */
    info(...args) {
        return this.send('info', args);
    }
    /**
     * Logs to Dexare on the `warn` level.
     * @param args The arguments to log
     */
    warn(...args) {
        return this.send('warn', args);
    }
    /**
     * Logs to Dexare on the `error` level.
     * @param args The arguments to log
     */
    error(...args) {
        return this.send('error', args);
    }
    /**
     * Logs to Dexare.
     * @param level The level to log to
     * @param args The arguments to log
     * @param extra The extra variables to log with
     */
    send(level, args, extra) {
        return this.client.emit('logger', level, this.module, args, extra);
    }
}
exports.default = LoggerHandler;
