"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./util/logger"));
class DexareModule {
    constructor(client, options) {
        this.registerQueue = [];
        this.loaded = false;
        this.options = options;
        this.client = client;
        this.logger = new logger_1.default(this.client, this.options.name);
    }
    /** @hidden */
    _load() {
        this.loaded = true;
        this.registerQueue.forEach(([{ event, before, after }, handler]) => this.registerEvent(event, handler, { before, after }));
        this.registerQueue.length = 0;
        this.load();
    }
    /** Fired when this module is loaded. */
    load() { }
    /** Fired when this module is being unloaded. */
    unload() { }
    registerEvent(event, handler, options) {
        return this.client.events.register(this.options.name, event, handler, options);
    }
    unregisterEvent(event) {
        return this.client.events.unregister(this.options.name, event);
    }
    unregisterAllEvents() {
        return this.client.events.unregisterGroup(this.options.name);
    }
}
exports.default = DexareModule;
