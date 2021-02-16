"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("@discordjs/collection"));
const path_1 = require("path");
const module_1 = __importDefault(require("../../module"));
const util_1 = require("../../util");
const command_1 = __importDefault(require("./command"));
const context_1 = __importDefault(require("./context"));
const interpreter_1 = __importDefault(require("./interpreter"));
const eval_1 = __importDefault(require("./default/eval"));
const help_1 = __importDefault(require("./default/help"));
const ping_1 = __importDefault(require("./default/ping"));
const exec_1 = __importDefault(require("./default/exec"));
const kill_1 = __importDefault(require("./default/kill"));
/** The commands module in Dexare. */
class CommandsModule extends module_1.default {
    constructor(client) {
        super(client, {
            name: 'commands',
            description: "Dexare's command handler."
        });
        /** The commands loaded into the module. */
        this.commands = new collection_1.default();
        this.filePath = __filename;
    }
    /** @hidden */
    load() {
        this.registerEvent('messageCreate', this.onMessage.bind(this));
    }
    /** @hidden */
    unload() {
        this.unregisterAllEvents();
    }
    /**
     * Registers a command.
     * @param command The command to register
     */
    register(command) {
        if (typeof command === 'function')
            command = new command(this.client);
        else if (typeof command.default === 'function')
            command = new command.default(this.client);
        if (!(command instanceof command_1.default))
            throw new Error(`Invalid command object to register: ${command}`);
        // Make sure there aren't any conflicts
        if (this.commands.some((cmd) => cmd.name === command.name || cmd.aliases.includes(command.name))) {
            throw new Error(`A command with the name/alias "${command.name}" is already registered.`);
        }
        for (const alias of command.aliases) {
            if (this.commands.some((cmd) => cmd.name === alias || cmd.aliases.includes(alias))) {
                throw new Error(`A command with the name/alias "${alias}" is already registered.`);
            }
        }
        command.preload();
        this.commands.set(command.name, command);
        this.logger.log(`Registered command ${command.name}.`);
        return command;
    }
    /**
     * Registers commands from a folder.
     * @param path The path to register from.
     */
    registerFromFolder(path) {
        return util_1.iterateFolder(path, async (file) => this.register(require(path_1.join(process.cwd(), file))));
    }
    /**
     * Re-registers a command.
     * @param command The new command
     * @param oldCommand The old command
     */
    reregister(command, oldCommand) {
        if (typeof command === 'function')
            command = new command(this.client);
        else if (typeof command.default === 'function')
            command = new command.default(this.client);
        if (!(command instanceof command_1.default))
            throw new Error(`Invalid command object to register: ${command}`);
        if (command.name !== oldCommand.name)
            throw new Error('Command name cannot change.');
        command.preload();
        this.commands.set(command.name, command);
        this.logger.log(`Reregistered command ${command.name}.`);
    }
    /**
     * Unregisters a command.
     * @param command The command to unregister
     */
    unregister(command) {
        this.commands.delete(command.name);
        this.logger.log(`Unregistered command ${command.name}.`);
    }
    /**
     * Find commands with a query.
     * @param searchString The string to search with
     * @param ctx The context to check with
     */
    find(searchString, ctx) {
        if (!searchString) {
            return ctx
                ? Array.from(this.commands.filter((cmd) => cmd.isUsable(ctx)).values())
                : Array.from(this.commands.values());
        }
        const matchedCommands = Array.from(this.commands
            .filter((cmd) => cmd.name === searchString || (cmd.aliases && cmd.aliases.some((ali) => ali === searchString)))
            .values());
        return matchedCommands;
    }
    /**
     * Registers default commands. (eval, help, ping)
     * @param commands The commands to register, if not defined, all commands are used.
     */
    registerDefaults(commands) {
        if (!commands)
            commands = ['eval', 'help', 'ping'];
        if (commands.includes('eval'))
            this.register(eval_1.default);
        if (commands.includes('help'))
            this.register(help_1.default);
        if (commands.includes('ping'))
            this.register(ping_1.default);
        if (commands.includes('exec'))
            this.register(exec_1.default);
        if (commands.includes('kill'))
            this.register(kill_1.default);
    }
    /** @hidden */
    _escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /** @hidden */
    _buildPrefixes(event) {
        const prefixes = [];
        let useMentionPrefix = false;
        let caseSensitive = false;
        if (event.has('prefix')) {
            const eventPrefixes = event.get('prefix');
            if (Array.isArray(eventPrefixes))
                prefixes.push(...eventPrefixes);
            else
                prefixes.push(eventPrefixes);
        }
        if (this.client.config.prefix && !event.has('skipConfigPrefix')) {
            const configPrefixes = this.client.config.prefix;
            if (Array.isArray(configPrefixes))
                prefixes.push(...configPrefixes);
            else
                prefixes.push(configPrefixes);
        }
        if ((this.client.config.mentionPrefix && !event.has('skipConfigPrefix')) || event.has('mentionPrefix'))
            useMentionPrefix = true;
        if (this.client.config.caseSensitivePrefix || event.has('caseSensitivePrefix'))
            caseSensitive = true;
        if (!prefixes.length && !useMentionPrefix)
            return;
        const escapedPrefixes = prefixes.map(this._escapeRegExp);
        if (useMentionPrefix)
            escapedPrefixes.push(`<@!?${this.client.bot.user.id}>`);
        return new RegExp(`^(?<prefix>${escapedPrefixes.join('|')}) ?`, caseSensitive ? '' : 'i');
    }
    /** @hidden */
    _logCommand(level, command, ...args) {
        return this.client.emit('logger', level, this.options.name, args, {
            command
        });
    }
    /** @hidden */
    async onMessage(event, message) {
        if (message.author.bot || message.author.system)
            return;
        const prefixRegex = this._buildPrefixes(event);
        if (!prefixRegex)
            return;
        const match = prefixRegex.exec(message.content);
        if (!message.content || !match)
            return;
        const prefixUsed = match.groups.prefix;
        const strippedContent = message.content.substr(match[0].length);
        const argInterpretor = new interpreter_1.default(strippedContent);
        const args = argInterpretor.parseAsStrings();
        const commandName = args.splice(0, 1)[0];
        const ctx = new context_1.default(this, event, args, prefixUsed, message);
        const command = this.find(commandName, ctx)[0];
        event.set('commands/invoked', !commandName || !command);
        if (!commandName || !command)
            return;
        event.set('commands/strippedContent', strippedContent);
        event.set('commands/commandName', commandName);
        event.set('commands/command', command);
        event.set('commands/ctx', ctx);
        /**
    
        // Obtain the member if we don't have it
        if ('permissionsOf' in message.channel && !ctx.guild?.members.has(ctx.author.id) && !message.webhookID) {
          const member = (await ctx.guild?.fetchMembers({ userIDs: [ctx.author.id] }))![0];
          ctx.guild!.members.set(ctx.author.id, member);
          ctx.member = member;
        }
    
        // Obtain the member for the ClientUser if it doesn't already exist
        if ('permissionsOf' in message.channel && !ctx.guild!.members.has(client.user.id)) {
          ctx.guild!.members.set(client.user.id, (await ctx.guild?.fetchMembers({ userIDs: [client.user.id] }))![0]);
        }
    
        **/
        // Ensure the user has permission to use the command
        const hasPermission = command.hasPermission(ctx);
        if (!hasPermission || typeof hasPermission === 'string') {
            const data = {
                response: typeof hasPermission === 'string' ? hasPermission : undefined
            };
            await command.onBlock(ctx, 'permission', data);
            return;
        }
        // Ensure the client user has the required permissions
        if ('permissionsOf' in message.channel && command.clientPermissions) {
            const perms = message.channel.permissionsOf(this.client.bot.user.id).json;
            const missing = command.clientPermissions.filter((perm) => !perms[perm]);
            if (missing.length > 0) {
                const data = { missing };
                await command.onBlock(ctx, 'clientPermissions', data);
                return;
            }
        }
        // Throttle the command
        const throttle = await command.throttle(ctx.author);
        if (throttle && command.throttling && throttle.usages + 1 > command.throttling.usages) {
            const remaining = (throttle.start + command.throttling.duration * 1000 - Date.now()) / 1000;
            const data = { throttle, remaining };
            command.onBlock(ctx, 'throttling', data);
            return;
        }
        if (throttle)
            throttle.usages++;
        // Run the command
        try {
            this._logCommand('debug', command, `Running command '${command.name}' (${ctx.author.username}#${ctx.author.discriminator}, ${ctx.author.id})`);
            const promise = command.run(ctx);
            const retVal = await promise;
            await command.finalize(retVal, ctx);
        }
        catch (err) {
            try {
                await command.onError(err, ctx);
            }
            catch (secondErr) {
                this._logCommand('error', command, command.name, secondErr);
            }
        }
    }
}
exports.default = CommandsModule;
