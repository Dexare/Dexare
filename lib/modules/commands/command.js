"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = __importDefault(require("eris"));
const common_tags_1 = require("common-tags");
const constants_1 = require("../../constants");
class DexareCommand {
    /**
     * @param creator The instantiating creator.
     * @param opts The options for the command.
     */
    constructor(client, opts) {
        /** Current throttle objects for the command, mapped by user ID. */
        this._throttles = new Map();
        /** Whether the command is enabled globally */
        this._globalEnabled = true;
        if (this.constructor.name === 'DexareCommand')
            throw new Error('The base DexareCommand cannot be instantiated.');
        this.cmdsModule = client.commands;
        this.client = client;
        this.name = opts.name;
        this.aliases = opts.aliases || [];
        this.category = opts.category || 'Uncategorized';
        this.description = opts.description;
        this.userPermissions = opts.userPermissions;
        this.clientPermissions = opts.clientPermissions;
        this.throttling = opts.throttling;
        this.metadata = opts.metadata;
    }
    /**
     * Checks whether the context member has permission to use the command.
     * @param ctx The triggering context
     * @return {boolean|string} Whether the member has permission, or an error message to respond with if they don't
     */
    hasPermission(ctx, event) {
        if (this.userPermissions) {
            let permissionMap = event && event.has('dexare/permissionMap')
                ? event.get('dexare/permissionMap')
                : {};
            permissionMap = this.client.permissions.map(ctx.message, this.userPermissions, permissionMap, event);
            if (event)
                event.set('dexare/permissionMap', permissionMap);
            const missing = this.userPermissions.filter((perm) => !permissionMap[perm]);
            if (missing.length > 0) {
                if (missing.includes('dexare.elevated'))
                    return `The \`${this.name}\` command can only be used by the bot developers or elevated users.`;
                else if (missing.includes('dexare.nsfwchannel'))
                    return `The \`${this.name}\` command can only be ran in NSFW channels.`;
                else if (missing.includes('dexare.inguild'))
                    return `The \`${this.name}\` command can only be ran in guilds.`;
                else if (missing.length === 1) {
                    return `The \`${this.name}\` command requires you to have the "${constants_1.PermissionNames[missing[0]] || missing[0]}" permission.`;
                }
                return common_tags_1.oneLine `
          The \`${this.name}\` command requires you to have the following permissions:
          ${missing.map((perm) => constants_1.PermissionNames[perm] || perm).join(', ')}
        `;
            }
        }
        return true;
    }
    /**
     * Called when the command is prevented from running.
     * @param ctx Command context the command is running from
     * @param reason Reason that the command was blocked
     * (built-in reasons are `permission`, `throttling`)
     * @param data Additional data associated with the block.
     * - permission: `response` ({@link string}) to send
     * - throttling: `throttle` ({@link Object}), `remaining` ({@link number}) time in seconds
     */
    onBlock(ctx, reason, data) {
        switch (reason) {
            case 'permission': {
                if (data.response)
                    return ctx.reply(data.response);
                return ctx.reply(`You do not have permission to use the \`${this.name}\` command.`);
            }
            case 'clientPermissions': {
                if (data.missing.length === 1) {
                    return ctx.reply(`I need the "${constants_1.PermissionNames['discord.' + data.missing[0].toLowerCase()]}" permission for the \`${this.name}\` command to work.`);
                }
                return ctx.reply(common_tags_1.oneLine `
					I need the following permissions for the \`${this.name}\` command to work:
					${data.missing
                    .map((perm) => constants_1.PermissionNames['discord.' + perm.toLowerCase()])
                    .join(', ')}
				`);
            }
            case 'throttling': {
                return ctx.reply(`You may not use the \`${this.name}\` command again for another ${data.remaining.toFixed(1)} seconds.`);
            }
            default:
                return null;
        }
    }
    /**
     * Called when the command produces an error while running.
     * @param err Error that was thrown
     * @param ctx Command context the command is running from
     */
    onError(err, ctx) {
        return ctx.reply(`An error occurred while running the \`${this.name}\` command.`);
    }
    /**
     * Checks if the command is usable for a message
     * @param message The message
     */
    isUsable(ctx) {
        if (!ctx)
            return this._globalEnabled;
        const hasPermission = this.hasPermission(ctx);
        return typeof hasPermission !== 'string' && hasPermission;
    }
    /**
     * Creates/obtains the throttle object for a user, if necessary.
     * @param userID ID of the user to throttle for
     * @private
     */
    async throttle(object, event) {
        if (!this.throttling)
            return null;
        if (this.throttling.bypass && this.throttling.bypass.length) {
            let permissionMap = event && event.has('dexare/permissionMap')
                ? event.get('dexare/permissionMap')
                : {};
            permissionMap = this.client.permissions.map(object, this.throttling.bypass, permissionMap, event);
            if (event)
                event.set('dexare/permissionMap', permissionMap);
            const missing = this.throttling.bypass.filter((perm) => !permissionMap[perm]);
            if (!missing.length)
                return;
        }
        let user;
        if (object instanceof eris_1.default.Message)
            user = object.author;
        else if (object instanceof eris_1.default.Member)
            user = object.user;
        else
            user = object;
        let throttle = this._throttles.get(user.id);
        if (!throttle) {
            throttle = {
                start: Date.now(),
                usages: 0,
                timeout: setTimeout(() => {
                    this._throttles.delete(user.id);
                }, this.throttling.duration * 1000)
            };
            this._throttles.set(user.id, throttle);
        }
        return throttle;
    }
    /**
     * Runs the command.
     * @param ctx The context of the message
     */
    async run(ctx) {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }
    /**
     * Preloads the command.
     * This function is called upon loading the command, NOT after logging in.
     */
    async preload() {
        return true;
    }
    /** Reloads the command. */
    reload() {
        if (!this.filePath)
            throw new Error('Cannot reload a command without a file path defined!');
        const newCommand = require(this.filePath);
        this.cmdsModule.reregister(newCommand, this);
    }
    /** Unloads the command. */
    unload() {
        if (this.filePath && require.cache[this.filePath])
            delete require.cache[this.filePath];
        this.cmdsModule.unregister(this);
    }
    /**
     * Finalizes the return output.
     * @param response The response from the command run
     * @param ctx The context of the message
     */
    finalize(response, ctx) {
        if (typeof response === 'string' ||
            (response &&
                response.constructor &&
                response.constructor.name === 'Object'))
            return ctx.send(response);
    }
}
exports.default = DexareCommand;
