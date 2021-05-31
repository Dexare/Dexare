import Eris from 'eris';
import DexareCommand from './modules/commands/command';

/** @hidden */
export interface ErisEvents {
  ready: () => void;
  disconnect: () => void;

  callCreate: (call: Eris.Call) => void;
  callRing: (call: Eris.Call) => void;
  callDelete: (call: Eris.Call) => void;

  callUpdate: (call: Eris.Call, oldCall: Eris.OldCall) => void;

  channelCreate: (channel: Eris.AnyChannel) => void;
  channelDelete: (channel: Eris.AnyChannel) => void;

  channelPinUpdate: (channel: Eris.TextableChannel, timestamp: number, oldTimestamp: number) => void;

  channelRecipientAdd: (channel: Eris.GroupChannel, user: Eris.User) => void;
  channelRecipientRemove: (channel: Eris.GroupChannel, user: Eris.User) => void;

  channelUpdate: (channel: Eris.AnyChannel, oldChannel: Eris.OldGuildChannel | Eris.OldGroupChannel) => void;

  connect: (id: number) => void;
  shardPreReady: (id: number) => void;

  friendSuggestionCreate: (user: Eris.User, reasons: Eris.FriendSuggestionReasons) => void;

  friendSuggestionDelete: (user: Eris.User) => void;

  guildBanAdd: (guild: Eris.Guild, user: Eris.User) => void;
  guildBanRemove: (guild: Eris.Guild, user: Eris.User) => void;

  guildAvailable: (guild: Eris.Guild) => void;
  guildCreate: (guild: Eris.Guild) => void;

  guildDelete: (guild: Eris.PossiblyUncachedGuild) => void;

  guildEmojisUpdate: (guild: Eris.Guild, emojis: Eris.Emoji[], oldEmojis: Eris.Emoji[]) => void;

  guildMemberAdd: (guild: Eris.Guild, member: Eris.Member) => void;

  guildMemberChunk: (guild: Eris.Guild, members: Eris.Member[]) => void;

  guildMemberRemove: (guild: Eris.Guild, member: Eris.Member | Eris.MemberPartial) => void;

  guildMemberUpdate: (
    guild: Eris.Guild,
    member: Eris.Member,
    oldMember: { nick?: string; premiumSince: number; roles: string[] } | null
  ) => void;

  guildRoleCreate: (guild: Eris.Guild, role: Eris.Role) => void;
  guildRoleDelete: (guild: Eris.Guild, role: Eris.Role) => void;

  guildRoleUpdate: (guild: Eris.Guild, role: Eris.Role, oldRole: Eris.OldRole) => void;

  guildUnavailable: (guild: Eris.UnavailableGuild) => void;
  unavailableGuildCreate: (guild: Eris.UnavailableGuild) => void;

  guildUpdate: (guild: Eris.Guild, oldRole: Eris.OldGuild) => void;

  hello: (trace: string[], id: number) => void;

  inviteCreate: (guild: Eris.Guild, invite: Eris.Invite) => void;
  inviteDelete: (guild: Eris.Guild, invite: Eris.Invite) => void;

  messageCreate: (message: Eris.Message) => void;

  messageDelete: (message: Eris.PossiblyUncachedMessage) => void;
  messageReactionRemoveAll: (message: Eris.PossiblyUncachedMessage) => void;

  messageReactionRemoveEmoji: (message: Eris.PossiblyUncachedMessage, emoji: Eris.PartialEmoji) => void;

  messageDeleteBulk: (messages: Eris.PossiblyUncachedMessage[]) => void;

  messageReactionAdd: (
    message: Eris.PossiblyUncachedMessage,
    emoji: Eris.Emoji,
    reactor: Eris.Member | { id: string }
  ) => void;

  messageReactionRemove: (
    message: Eris.PossiblyUncachedMessage,
    emoji: Eris.PartialEmoji,
    userID: string
  ) => void;

  messageUpdate: (message: Eris.Message, oldMessage: Eris.OldMessage | null) => void;

  presenceUpdate: (message: Eris.Member | Eris.Relationship, oldPresence: Eris.Presence | null) => void;

  rawREST: (request: Eris.RawRESTRequest) => void;

  rawWS: (packet: Eris.RawPacket, id: number) => void;
  unknown: (packet: Eris.RawPacket, id: number) => void;

  relationshipAdd: (relationship: Eris.Relationship) => void;
  relationshipRemove: (relationship: Eris.Relationship) => void;

  relationshipUpdate: (relationship: Eris.Relationship, oldRelationship: { type: number }) => void;

  typingStart: (
    channel: Eris.TextableChannel | { id: string },
    user: Eris.User | { id: string },
    member: Eris.Member | null
  ) => void;

  userUpdate: (user: Eris.User, oldUser: Eris.PartialUser | null) => void;

  voiceChannelJoin: (member: Eris.Member, newChannel: Eris.VoiceChannel) => void;
  voiceChannelLeave: (member: Eris.Member, oldChannel: Eris.VoiceChannel) => void;

  voiceChannelSwitch: (
    member: Eris.Member,
    newChannel: Eris.VoiceChannel,
    oldChannel: Eris.VoiceChannel
  ) => void;

  voiceStateUpdate: (member: Eris.Member, oldState: Eris.OldVoiceState) => void;

  warn: (message: string, id: number) => void;
  debug: (message: string, id: number) => void;

  webhooksUpdate: (data: Eris.WebhookData) => void;

  shardReady: (id: number) => void;
  shardResume: (id: number) => void;

  shardDisconnect: (err: Error, id: number) => void;
  error: (err: Error, id: number) => void;
}

/** @hidden */
interface LoggerExtraBase {
  [key: string]: any;
}

/** Extra data for logger events. */
export interface LoggerExtra extends LoggerExtraBase {
  command?: DexareCommand;
  id?: number;
  trace?: string[];
}

/** The object for checking permissions. */
export interface PermissionObject {
  user: Eris.User;
  member?: Eris.Member;
  message?: Eris.Message;
}
