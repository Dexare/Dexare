import Collection from '@discordjs/collection';
import Eris from 'eris';
import { PermissionObject } from '../types';
import LoggerHandler from '../util/logger';
import { ClientEvent } from './events';
import DexareClient from './index';

/** The function for a permission. */
export type PermissionFunction<T extends DexareClient<any>> = (
  object: PermissionObject,
  client: T,
  event?: ClientEvent
) => boolean;

export const DirectMessagePermissions = [
  'addReactions',
  'readMessages',
  'sendMessages',
  'embedLinks',
  'attachFiles',
  'readMessageHistory',
  'externalEmojis'
];

export const CorePermissions = [
  ...Object.keys(Eris.Constants.Permissions).map((permission) => 'discord.' + permission.toLowerCase()),
  'dexare.elevated',
  'dexare.inguild',
  'dexare.nsfwchannel'
];

/** The registry for permissions in Dexare. */
export default class PermissionRegistry<T extends DexareClient<any>> {
  readonly permissions = new Collection<string, PermissionFunction<T>>();
  private readonly logger: LoggerHandler<T>;
  private readonly client: T;

  constructor(client: T) {
    this.client = client;
    this.logger = new LoggerHandler<T>(this.client, 'dexare/permissions');

    for (const permission in Eris.Constants.Permissions) {
      this.permissions.set('discord.' + permission.toLowerCase(), (object) => {
        if (object instanceof Eris.Message)
          if ('guild' in object.channel && object.member)
            return object.channel
              .permissionsOf(object.member)
              .has(permission as keyof Eris.Constants['Permissions']);
          else return DirectMessagePermissions.includes(permission);
        else if (object instanceof Eris.Member)
          return object.guild.permissionsOf(object).has(permission as keyof Eris.Constants['Permissions']);
        return DirectMessagePermissions.includes(permission);
      });
    }

    this.permissions.set('dexare.elevated', (object, client) => {
      if (!client.config.elevated) return false;

      if (Array.isArray(client.config.elevated)) return client.config.elevated.includes(object.user.id);
      return client.config.elevated === object.user.id;
    });

    this.permissions.set('dexare.inguild', (object) => {
      if (object.member) return true;
      if (object.message) return 'guild' in object.message.channel;
      return false;
    });

    this.permissions.set('dexare.nsfwchannel', (object) => {
      // False for users, why would anyone use a channel perm on users
      if (!object.message) return false;
      return 'nsfw' in object.message.channel ? object.message.channel.nsfw : true;
    });
  }

  /**
   * Registers a new permission.
   * @param key The permission key to register
   * @param permission The permission function to use
   */
  register(key: string, permission: PermissionFunction<T>): void {
    key = key.toLowerCase();
    if (CorePermissions.includes(key)) throw new Error(`Cannot register to core permissions. (${key})`);
    this.logger.log(`Registering permission '${key}'`);

    this.permissions.set(key, permission);
  }

  /**
   * Unregisters a permission.
   * @param key The permission to unregister
   */
  unregister(key: string): boolean {
    key = key.toLowerCase();
    if (CorePermissions.includes(key)) throw new Error(`Cannot unregister core permissions. (${key})`);
    this.logger.log(`Unregistering permission '${key}'`);

    return this.permissions.delete(key);
  }

  /**
   * Check a permission.
   * @param object The object to check with
   * @param permission The permission to check
   * @param event The client event to associate the function
   */
  has(object: PermissionObject, permission: string, event?: ClientEvent) {
    permission = permission.toLowerCase();
    if (!permission || !this.permissions.has(permission)) return false;
    return this.permissions.get(permission)!(object, this.client, event);
  }

  /**
   * Maps permissions into an object with true/false values and permission keys.
   * @param object The object to check with
   * @param permissions The permissions to map
   * @param prevMap The previous map, if any
   * @param event The client event to associate
   */
  map(
    object: PermissionObject,
    permissions: string[],
    prevMap: { [permission: string]: boolean } = {},
    event?: ClientEvent
  ) {
    for (const permission of permissions) {
      if (permission in prevMap) continue;
      prevMap[permission] = this.has(object, permission, event);
    }

    return prevMap;
  }

  /**
   * Convert something into a permission object.
   * @param object The object to convert
   */
  toObject(object: Eris.Message | Eris.User | Eris.Member): PermissionObject {
    const result: any = {};

    let user: Eris.User;
    if (object instanceof Eris.Message) user = object.author;
    else if (object instanceof Eris.Member) user = object.user;
    else user = object;

    result.user = user;
    if (object instanceof Eris.Message) result.message = object;
    if (object instanceof Eris.Member) result.member = object;

    return result;
  }
}
