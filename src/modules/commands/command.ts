import Eris from 'eris';
import { oneLine } from 'common-tags';
import CommandsModule from '.';
import DexareClient from '../../client';
import { PermissionNames } from '../../constants';
import CommandContext from './context';
import { ClientEvent } from '../../client/events';

/** The options for a {@link DexareCommand}. */
export interface CommandOptions {
  /** The name of the command. */
  name: string;
  /** The command's aliases. */
  aliases?: string[];
  /** The command's category. */
  category?: string;
  /** The description of the command. */
  description?: string;
  /** The required permission(s) for a user to use this command. */
  userPermissions?: string[];
  /** The required client permission(s) for this command. */
  clientPermissions?: (keyof Eris.Constants['Permissions'])[];
  /** The throttling options for the command. */
  throttling?: ThrottlingOptions;
  /** Metadata for the command. Useful for any other identifiers for the command. */
  metadata?: any;
}

/** The throttling options for a {@link DexareCommand}. */
export interface ThrottlingOptions {
  /** Maximum number of usages of the command allowed in the time frame. */
  usages: number;
  /** Amount of time to count the usages of the command within (in seconds). */
  duration: number;
  /** The Dexare permissions that can bypass throttling. */
  bypass?: string[];
}

export default class DexareCommand {
  /** The command's name. */
  readonly name: string;
  /** The command's aliases. */
  readonly aliases: string[];
  /** The command's category. */
  readonly category: string;
  /** The command's description. */
  readonly description?: string;
  /** The permissions required to use this command. */
  readonly userPermissions?: string[];
  /** The permissions the client is required to have for this command. */
  readonly clientPermissions?: (keyof Eris.Constants['Permissions'])[];
  /** The throttling options for this command. */
  readonly throttling?: ThrottlingOptions;
  /** Metadata for the command. */
  readonly metadata?: any;
  /**
   * The file path of the command.
   * Used for refreshing the require cache.
   * Set this to `__filename` in the constructor to enable cache clearing.
   */
  filePath?: string;

  /** The commands module. */
  readonly cmdsModule: CommandsModule<DexareClient<any>>;
  /** The client from the commands module. */
  readonly client: DexareClient<any>;

  /** Whether the command is enabled globally */
  private _globalEnabled = true;

  /**
   * @param creator The instantiating creator.
   * @param opts The options for the command.
   */
  constructor(client: DexareClient<any>, opts: CommandOptions) {
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
  hasPermission(ctx: CommandContext, event?: ClientEvent): boolean | string {
    if (this.userPermissions) {
      let permissionMap = event && event.has('dexare/permissionMap') ? event.get('dexare/permissionMap') : {};
      permissionMap = this.client.permissions.map(ctx.message, this.userPermissions, permissionMap, event);
      if (event) event.set('dexare/permissionMap', permissionMap);
      const missing = this.userPermissions.filter((perm: string) => !permissionMap[perm]);

      if (missing.length > 0) {
        if (missing.includes('dexare.elevated'))
          return `The \`${this.name}\` command can only be used by the bot developers or elevated users.`;
        else if (missing.includes('dexare.nsfwchannel'))
          return `The \`${this.name}\` command can only be ran in NSFW channels.`;
        else if (missing.includes('dexare.inguild'))
          return `The \`${this.name}\` command can only be ran in guilds.`;
        else if (missing.length === 1) {
          return `The \`${this.name}\` command requires you to have the "${
            PermissionNames[missing[0]] || missing[0]
          }" permission.`;
        }
        return oneLine`
          The \`${this.name}\` command requires you to have the following permissions:
          ${missing.map((perm) => PermissionNames[perm] || perm).join(', ')}
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
  onBlock(ctx: CommandContext, reason: string, data?: any) {
    switch (reason) {
      case 'permission': {
        if (data.response) return ctx.reply(data.response);
        return ctx.reply(`You do not have permission to use the \`${this.name}\` command.`);
      }
      case 'clientPermissions': {
        if (data.missing.length === 1) {
          return ctx.reply(
            `I need the "${
              PermissionNames['discord.' + data.missing[0].toLowerCase()]
            }" permission for the \`${this.name}\` command to work.`
          );
        }
        return ctx.reply(oneLine`
					I need the following permissions for the \`${this.name}\` command to work:
					${data.missing.map((perm: string) => PermissionNames['discord.' + perm.toLowerCase()]).join(', ')}
				`);
      }
      case 'throttling': {
        return ctx.reply(
          data.remaining
            ? `You may not use the \`${this.name}\` command again for another ${data.remaining.toFixed(
                1
              )} seconds.`
            : `You are currently ratelimited from using the \`${this.name}\` command. Try again later.`
        );
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
  onError(err: Error, ctx: CommandContext) {
    return ctx.reply(`An error occurred while running the \`${this.name}\` command.`);
  }

  /**
   * Checks if the command is usable for a message
   * @param message The message
   */
  isUsable(ctx: CommandContext) {
    if (!ctx) return this._globalEnabled;
    const hasPermission = this.hasPermission(ctx);
    return typeof hasPermission !== 'string' && hasPermission;
  }

  /**
   * Used to throttle a user from the command.
   * @param object The permission object to throttle
   * @param event The event to use
   */
  async throttle(object: Eris.Message | Eris.User | Eris.Member, event?: ClientEvent) {
    if (!this.throttling) return;

    if (this.throttling.bypass && this.throttling.bypass.length) {
      let permissionMap = event && event.has('dexare/permissionMap') ? event.get('dexare/permissionMap') : {};
      permissionMap = this.client.permissions.map(object, this.throttling.bypass, permissionMap, event);
      if (event) event.set('dexare/permissionMap', permissionMap);
      const missing = this.throttling.bypass.filter((perm: string) => !permissionMap[perm]);
      if (!missing.length) return;
    }

    let user: Eris.User;
    if (object instanceof Eris.Message) user = object.author;
    else if (object instanceof Eris.Member) user = object.user;
    else user = object;

    return await this.client.data.throttle('command_' + this.name, this.throttling, user.id, event);
  }

  /**
   * Runs the command.
   * @param ctx The context of the message
   */
  async run(ctx: CommandContext): Promise<string|Eris.MessageContent|void> { // eslint-disable-line @typescript-eslint/no-unused-vars, prettier/prettier
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  /**
   * Preloads the command.
   * This function is called upon loading the command, NOT after logging in.
   */
  async preload(): Promise<any> {
    return true;
  }

  /** Reloads the command. */
  reload() {
    if (!this.filePath) throw new Error('Cannot reload a command without a file path defined!');
    const newCommand = require(this.filePath);
    this.cmdsModule.reregister(newCommand, this);
  }

  /** Unloads the command. */
  unload() {
    if (this.filePath && require.cache[this.filePath]) delete require.cache[this.filePath];
    this.cmdsModule.unregister(this);
  }

  /**
   * Finalizes the return output.
   * @param response The response from the command run
   * @param ctx The context of the message
   */
  finalize(response: any, ctx: CommandContext) {
    if (
      typeof response === 'string' ||
      (response && response.constructor && response.constructor.name === 'Object')
    )
      return ctx.send(response);
  }
}
