"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorePermissions = exports.DirectMessagePermissions = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const eris_1 = __importDefault(require("eris"));
const logger_1 = __importDefault(require("../util/logger"));
exports.DirectMessagePermissions = [
    'addReactions',
    'readMessages',
    'sendMessages',
    'embedLinks',
    'attachFiles',
    'readMessageHistory',
    'externalEmojis'
];
exports.CorePermissions = [
    ...Object.keys(eris_1.default.Constants.Permissions).map((permission) => 'discord.' + permission.toLowerCase()),
    'dexare.elevated',
    'dexare.inguild',
    'dexare.nsfwchannel'
];
/** The registry for permissions in Dexare. */
class PermissionRegistry {
    constructor(client) {
        this.permissions = new collection_1.default();
        this.client = client;
        this.logger = new logger_1.default(this.client, 'dexare/permissions');
        for (const permission in eris_1.default.Constants.Permissions) {
            this.permissions.set('discord.' + permission.toLowerCase(), (object) => {
                if (object instanceof eris_1.default.Message)
                    if ('guild' in object.channel && object.member)
                        return object.channel.permissionsOf(object.member).has(permission);
                    else
                        return exports.DirectMessagePermissions.includes(permission);
                else if (object instanceof eris_1.default.Member)
                    return object.guild.permissionsOf(object).has(permission);
                return exports.DirectMessagePermissions.includes(permission);
            });
        }
        this.permissions.set('dexare.elevated', (object, client) => {
            if (!client.config.elevated)
                return false;
            let user;
            if (object instanceof eris_1.default.Message)
                user = object.author;
            else if (object instanceof eris_1.default.Member)
                user = object.user;
            else
                user = object;
            if (Array.isArray(client.config.elevated))
                return client.config.elevated.includes(user.id);
            return client.config.elevated === user.id;
        });
        this.permissions.set('dexare.inguild', (object) => {
            if (object instanceof eris_1.default.User)
                return false;
            if (object instanceof eris_1.default.Member)
                return true;
            return 'guild' in object.channel;
        });
        this.permissions.set('dexare.nsfwchannel', (object) => {
            // False for users, why would anyone use a channel perm on users
            if (!(object instanceof eris_1.default.Message))
                return false;
            return 'nsfw' in object.channel ? object.channel.nsfw : true;
        });
    }
    /**
     * Registers a new permission.
     * @param key The permission key to register
     * @param permission The permission function to use
     */
    register(key, permission) {
        key = key.toLowerCase();
        if (exports.CorePermissions.includes(key))
            throw new Error(`Cannot register to core permissions. (${key})`);
        this.logger.log(`Registering permission '${key}'`);
        this.permissions.set(key, permission);
    }
    /**
     * Unregisters a permission.
     * @param key The permission to unregister
     */
    unregister(key) {
        key = key.toLowerCase();
        if (exports.CorePermissions.includes(key))
            throw new Error(`Cannot unregister core permissions. (${key})`);
        this.logger.log(`Unregistering permission '${key}'`);
        return this.permissions.delete(key);
    }
    /**
     * Check a permission.
     * @param object The object to check with
     * @param permission The permission to check
     * @param event The client event to associate the function
     */
    has(object, permission, event) {
        permission = permission.toLowerCase();
        if (!permission || !this.permissions.has(permission))
            return false;
        return this.permissions.get(permission)(object, this.client, event);
    }
    /**
     * Maps permissions into an object with true/false values and permission keys.
     * @param object The object to check with
     * @param permissions The permissions to map
     * @param prevMap The previous map, if any
     * @param event The client event to associate
     */
    map(object, permissions, prevMap = {}, event) {
        for (const permission of permissions) {
            if (permission in prevMap)
                continue;
            prevMap[permission] = this.has(object, permission, event);
        }
        return prevMap;
    }
}
exports.default = PermissionRegistry;
