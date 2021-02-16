"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("@discordjs/collection"));
const eris_1 = __importDefault(require("eris"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const constants_1 = require("../constants");
const module_1 = __importDefault(require("../module"));
const commands_1 = __importDefault(require("../modules/commands"));
const commands_2 = __importDefault(require("../modules/commands"));
const logger_1 = __importDefault(require("../util/logger"));
const events_1 = __importDefault(require("./events"));
const permissions_1 = __importDefault(require("./permissions"));
class DexareClient extends eventemitter3_1.default {
    constructor(config) {
        // eslint-disable-next-line constructor-super
        super();
        this.events = new events_1.default(this);
        this.logger = new logger_1.default(this, 'dexare/client');
        this.modules = new collection_1.default();
        this.commands = new commands_1.default(this);
        this.collector = new commands_2.default(this);
        // eslint-disable-next-line no-undef
        this._typingIntervals = new Map();
        this._hookedEvents = [];
        this._erisEventsLogged = false;
        this.config = config;
        this.bot = new eris_1.default.Client(this.config.token, this.config.erisOptions);
        this.permissions = new permissions_1.default(this);
        this.modules.set('commands', this.commands);
        this.commands._load();
        this.modules.set('collector', this.collector);
    }
    /**
     * Load modules into the client.
     * @param moduleObjects The modules to load.
     */
    loadModules(...moduleObjects) {
        const modules = moduleObjects.map(this._resolveModule.bind(this));
        const loadOrder = this._getLoadOrder(modules);
        for (const modName of loadOrder) {
            const mod = modules.find((mod) => mod.options.name === modName);
            this.modules.set(modName, mod);
            mod._load();
        }
        return this;
    }
    /**
     * Unloads a module.
     * @param moduleName The module to unload
     */
    async unloadModule(moduleName) {
        if (!this.modules.has(moduleName))
            return;
        const mod = this.modules.get(moduleName);
        await mod.unload();
        this.modules.delete(moduleName);
    }
    /**
     * Log events to console.
     * @param logLevel The level to log at.
     * @param excludeModules The modules to exclude
     */
    logToConsole(logLevel = 'info', excludeModules = []) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const index = levels.indexOf(logLevel);
        this.on('logger', (level, moduleName, args) => {
            let importance = levels.indexOf(level);
            if (importance === -1)
                importance = 0;
            if (importance < index)
                return;
            if (excludeModules.includes(moduleName))
                return;
            let logFunc = console.debug;
            if (level === 'info')
                logFunc = console.info;
            else if (level === 'error')
                logFunc = console.error;
            else if (level === 'warn')
                logFunc = console.warn;
            logFunc(level.toUpperCase(), `[${moduleName}]`, ...args);
        });
        return this;
    }
    /** Logs informational Eris events to Dexare's logger event. */
    logErisEvents() {
        if (this._erisEventsLogged)
            return this;
        this._erisEventsLogged = true;
        this.on('ready', () => this.emit('logger', 'info', 'eris', ['All shards ready.']));
        this.on('disconnect', () => this.emit('logger', 'info', 'eris', ['All shards disconnected.']));
        this.on('reconnecting', () => this.emit('logger', 'info', 'eris', ['Reconnecting...']));
        this.on('debug', (message, id) => this.emit('logger', 'debug', 'eris', [message], { id }));
        this.on('warn', (message, id) => this.emit('logger', 'warn', 'eris', [message], { id }));
        this.on('error', (error, id) => this.emit('logger', 'error', 'eris', [error], { id }));
        this.on('connect', (id) => this.emit('logger', 'info', 'eris', ['Shard connected.'], { id }));
        this.on('hello', (trace, id) => this.emit('logger', 'debug', 'eris', ['Shard recieved hello.'], {
            id,
            trace
        }));
        this.on('shardReady', (id) => this.emit('logger', 'info', 'eris', ['Shard ready.'], { id }));
        this.on('shardResume', (id) => this.emit('logger', 'warn', 'eris', ['Shard resumed.'], { id }));
        this.on('shardDisconnect', (error, id) => this.emit('logger', 'warn', 'eris', ['Shard disconnected.', error], {
            id
        }));
        return this;
    }
    /**
     * Register an event.
     * @param event The event to register
     * @param listener The event listener
     */
    on(event, listener) {
        if (typeof event === 'string' && !this._hookedEvents.includes(event) && constants_1.ErisEventNames.includes(event)) {
            this.bot.on(event, (...args) => this.emit(event, ...args));
            this._hookedEvents.push(event);
        }
        return super.on(event, listener);
    }
    /**
     * Creates a promise that resolves on the next event
     * @param event The event to wait for
     */
    waitTill(event) {
        return new Promise((resolve) => this.once(event, resolve));
    }
    /** Connects and logs in to Discord. */
    connect() {
        return this.bot.connect();
    }
    /** Disconnects the bot. */
    disconnect(reconnect = false) {
        return this.bot.disconnect({ reconnect });
    }
    /**
     * Start typing in a channel
     * @param channelID The channel's ID to start typing in
     */
    async startTyping(channelID) {
        if (this.isTyping(channelID))
            return;
        await this.bot.sendChannelTyping(channelID);
        this._typingIntervals.set(channelID, setInterval(() => {
            this.bot.sendChannelTyping(channelID).catch(() => this.stopTyping(channelID));
        }, 5000));
    }
    /**
     * Whether the bot is currently typing in a channel.
     * @param channelID The channel ID to check for
     */
    isTyping(channelID) {
        return this._typingIntervals.has(channelID);
    }
    /**
     * Stops typing in a channel.
     * @param channelID The channel's ID to stop typing in
     */
    stopTyping(channelID) {
        if (!this.isTyping(channelID))
            return;
        const interval = this._typingIntervals.get(channelID);
        clearInterval(interval);
        this._typingIntervals.delete(channelID);
    }
    /** @hidden */
    _resolveModule(moduleObject) {
        if (typeof moduleObject === 'function')
            moduleObject = new moduleObject(this);
        else if (typeof moduleObject.default === 'function')
            moduleObject = new moduleObject.default(this);
        if (!(moduleObject instanceof module_1.default))
            throw new Error(`Invalid module object to load: ${moduleObject}`);
        return moduleObject;
    }
    /** @hidden */
    _getLoadOrder(modules) {
        const loadOrder = [];
        function insert(mod) {
            if (mod.options.requires && mod.options.requires.length)
                mod.options.requires.forEach((modName) => {
                    const dep = modules.find((mod) => mod.options.name === modName);
                    if (!dep)
                        throw new Error(`Module '${mod.options.name}' requires dependency '${modName}' which does not exist!`);
                    insert(dep);
                });
            if (!loadOrder.includes(mod.options.name))
                loadOrder.push(mod.options.name);
        }
        modules.forEach((mod) => insert(mod));
        return loadOrder;
    }
}
exports.default = DexareClient;
