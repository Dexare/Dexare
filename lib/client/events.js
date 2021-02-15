"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEvent = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("../util/logger"));
/** An object that temporarily stores the data of an event. */
class ClientEvent {
    constructor(name) {
        /** The groups that have been (or will be) skipped. */
        this.skipped = [];
        /** The data for this event. Can be altered at any time */
        this.data = new Map();
        this.name = name;
    }
    /**
     * Skip a group's listener for this event, if it has not already been fired.
     * @param group The group/extension/module name
     */
    skip(group) {
        if (!this.skipped.includes(group))
            this.skipped.push(group);
    }
    /**
     * Whether a data key exists within the data.
     */
    has(key) {
        return this.data.has(key);
    }
    /**
     * Gets a key within the event's data.
     */
    get(key) {
        return this.data.get(key);
    }
    /**
     * Sets a key within the event's data.
     */
    set(key, data) {
        return this.data.set(key, data);
    }
}
exports.ClientEvent = ClientEvent;
/** The event registry that handles the event system. */
class EventRegistry {
    constructor(client) {
        this.eventGroups = new collection_1.default();
        this.loadOrders = new Map();
        this.hookedEvents = [];
        this.client = client;
        this.logger = new logger_1.default(this.client, 'dexare/events');
    }
    /**
     * Registers an event.
     * @param groupName The group to register with
     * @param event The event to register
     * @param listener The event listener
     * @param options The options for the event
     */
    register(groupName, event, listener, options) {
        this.logger.log(`Registering event '${event}' for group '${groupName}'`);
        const eventGroup = this.eventGroups.has(groupName)
            ? this.eventGroups.get(groupName)
            : {};
        eventGroup[event] = {
            group: groupName,
            before: (options && options.before) || [],
            after: (options && options.after) || [],
            listener
        };
        this.eventGroups.set(groupName, eventGroup);
        this.hookEvent(event);
        this.refreshLoadOrder(event);
    }
    /**
     * Unregisters an event from a group.
     * @param groupName The group to unregister from
     * @param event The event to unregister
     */
    unregister(groupName, event) {
        this.logger.log(`Unregistering event '${event}' from group '${groupName}'`);
        if (!this.eventGroups.has(groupName))
            return;
        const eventGroup = this.eventGroups.get(groupName);
        delete eventGroup[event];
        this.eventGroups.set(groupName, eventGroup);
        this.refreshLoadOrder(event);
    }
    /**
     * Unregisters a group, removing all of their listeners.
     * @param groupName The group to unregister
     */
    unregisterGroup(groupName) {
        this.logger.log(`Unregistering event group '${groupName}'`);
        const refresh = this.eventGroups.has(groupName);
        const result = this.eventGroups.delete(groupName);
        if (refresh)
            this.refreshAllLoadOrders();
        return result;
    }
    /**
     * Emits an event.
     * @param event The event to emit
     * @param args The arcuments to emit with
     */
    emit(event, ...args) {
        if (!this.loadOrders.has(event))
            this.refreshLoadOrder(event);
        const loadOrder = this.loadOrders.get(event);
        const clientEvent = new ClientEvent(event);
        // Do async emitting w/o returning promises
        (async () => {
            for (const groupName of loadOrder) {
                if (clientEvent.skipped.includes(groupName))
                    continue;
                try {
                    await this.eventGroups
                        .get(groupName)[event].listener(clientEvent, ...args);
                }
                catch (e) { }
            }
        })();
    }
    /**
     * Emits an event asynchronously.
     * @param event The event to emit
     * @param args The arcuments to emit with
     */
    async emitAsync(event, ...args) {
        if (!this.loadOrders.has(event))
            this.refreshLoadOrder(event);
        const loadOrder = this.loadOrders.get(event);
        const clientEvent = new ClientEvent(event);
        for (const groupName of loadOrder) {
            if (clientEvent.skipped.includes(groupName))
                continue;
            try {
                await this.eventGroups
                    .get(groupName)[event].listener(clientEvent, ...args);
            }
            catch (e) { }
        }
    }
    hookEvent(event) {
        if (this.hookedEvents.includes(event))
            return;
        this.hookedEvents.push(event);
        this.client.on(event, (...args) => this.emit(event, ...args));
    }
    refreshLoadOrder(event) {
        this.loadOrders.set(event, this.createLoadOrder(event));
    }
    refreshAllLoadOrders() {
        const events = lodash_1.uniq(this.eventGroups.reduce((prev, group) => Object.keys(group).concat(prev), []));
        events.forEach((event) => this.refreshLoadOrder(event));
    }
    createLoadOrder(event) {
        const handlers = this.eventGroups
            .array()
            .filter((group) => event in group)
            .map((group) => group[event]);
        const loadOrder = [];
        function insert(handler) {
            if (handler.before && handler.before.length)
                handler.before.forEach((groupName) => {
                    const dep = handlers.find((handler) => handler.group === groupName);
                    if (dep)
                        insert(dep);
                });
            if (!loadOrder.includes(handler.group))
                loadOrder.push(handler.group);
            if (handler.after && handler.after.length)
                handler.after.forEach((groupName) => {
                    const dep = handlers.find((handler) => handler.group === groupName);
                    if (dep)
                        insert(dep);
                });
        }
        // handle "afters" first
        handlers
            .filter((group) => group.after.length)
            .forEach((handler) => insert(handler));
        // handle "befores" second
        handlers
            .filter((group) => group.before.length)
            .forEach((handler) => insert(handler));
        // handle others last
        handlers
            .filter((group) => !group.before.length && !group.after.length)
            .forEach((handler) => insert(handler));
        return loadOrder;
    }
}
exports.default = EventRegistry;
