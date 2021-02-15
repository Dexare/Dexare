import Collection from '@discordjs/collection';
import Eris from 'eris';
import { ClientEvent } from './events';
import DexareClient from './index';
/** The function for a permission. */
export declare type PermissionFunction<T extends DexareClient<any>> = (object: Eris.Message | Eris.User | Eris.Member, client: T, event?: ClientEvent) => boolean;
export declare const DirectMessagePermissions: string[];
export declare const CorePermissions: string[];
/** The registry for permissions in Dexare. */
export default class PermissionRegistry<T extends DexareClient<any>> {
    readonly permissions: Collection<string, PermissionFunction<T>>;
    private readonly logger;
    private readonly client;
    constructor(client: T);
    /**
     * Registers a new permission.
     * @param key The permission key to register
     * @param permission The permission function to use
     */
    register(key: string, permission: PermissionFunction<T>): void;
    /**
     * Unregisters a permission.
     * @param key The permission to unregister
     */
    unregister(key: string): boolean;
    /**
     * Check a permission.
     * @param object The object to check with
     * @param permission The permission to check
     * @param event The client event to associate the function
     */
    has(object: Eris.Message | Eris.User | Eris.Member, permission: string, event?: ClientEvent): boolean;
    /**
     * Maps permissions into an object with true/false values and permission keys.
     * @param object The object to check with
     * @param permissions The permissions to map
     * @param prevMap The previous map, if any
     * @param event The client event to associate
     */
    map(object: Eris.Message | Eris.User | Eris.Member, permissions: string[], prevMap?: {
        [permission: string]: boolean;
    }, event?: ClientEvent): {
        [permission: string]: boolean;
    };
}
