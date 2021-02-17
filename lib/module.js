"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./util/logger"));
/** A module for Dexare. */
class DexareModule {
    constructor(client, options) {
        /** @hidden */
        this.registerQueue = [];
        /** Whether the module has been loaded. */
        this.loaded = false;
        this.options = options;
        this.client = client;
        this.logger = new logger_1.default(this.client, this.options.name);
    }
    /** @hidden */
    async _load() {
        this.loaded = true;
        this.registerQueue.forEach(([{ event, before, after }, handler]) => this.registerEvent(event, handler, { before, after }));
        this.registerQueue.length = 0;
        await this.load();
    }
    /** Fired when this module is loaded. */
    load() { }
    /** Fired when this module is being unloaded. */
    unload() { }
    /**
     * Registers an event for this module.
     * @param event The event to register
     * @param handler The event handler
     * @param options The options for the handler
     */
    registerEvent(event, handler, options) {
        return this.client.events.register(this.options.name, event, handler, options);
    }
    /**
     * Unregisters an event from this module.
     * @param event The event to unregister
     */
    unregisterEvent(event) {
        return this.client.events.unregister(this.options.name, event);
    }
    /** Unregisters all events from this module. */
    unregisterAllEvents() {
        return this.client.events.unregisterGroup(this.options.name);
    }
}
exports.default = DexareModule;
