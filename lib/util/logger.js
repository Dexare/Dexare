"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerHandler {
    constructor(client, moduleName) {
        this.client = client;
        this.module = moduleName;
    }
    debug(...args) {
        return this.client.emit('logger', 'debug', this.module, args);
    }
    log(...args) {
        return this.client.emit('logger', 'debug', this.module, args);
    }
    info(...args) {
        return this.client.emit('logger', 'info', this.module, args);
    }
    warn(...args) {
        return this.client.emit('logger', 'warn', this.module, args);
    }
    error(...args) {
        return this.client.emit('logger', 'error', this.module, args);
    }
}
exports.default = LoggerHandler;
