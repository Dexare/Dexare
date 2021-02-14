import Collection from '@discordjs/collection';
import Eris from 'eris';
import { ClientEvent } from './events';
import DexareClient from './index';
export declare type PermissionFunction<T extends DexareClient<any>> = (object: Eris.Message | Eris.User | Eris.Member, client: T, event?: ClientEvent) => boolean;
export declare const DirectMessagePermissions: string[];
export declare const CorePermissions: string[];
export default class PermissionRegistry<T extends DexareClient<any>> {
    readonly permissions: Collection<string, PermissionFunction<T>>;
    private readonly logger;
    private readonly client;
    constructor(client: T);
    register(key: string, permission: PermissionFunction<T>): void;
    unregister(key: string): boolean;
    has(object: Eris.Message | Eris.User | Eris.Member, permission: string, event?: ClientEvent): boolean;
    map(object: Eris.Message | Eris.User | Eris.Member, permissions: string[], prevMap?: {
        [permission: string]: boolean;
    }, event?: ClientEvent): {
        [permission: string]: boolean;
    };
}
