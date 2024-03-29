export const ErisEventNames = [
  'ready',
  'disconnect',
  'callCreate',
  'callRing',
  'callDelete',
  'callUpdate',
  'channelCreate',
  'channelDelete',
  'channelPinUpdate',
  'channelRecipientAdd',
  'channelRecipientRemove',
  'channelUpdate',
  'connect',
  'shardPreReady',
  'friendSuggestionCreate',
  'friendSuggestionDelete',
  'guildBanAdd',
  'guildBanRemove',
  'guildAvailable',
  'guildCreate',
  'guildDelete',
  'guildEmojisUpdate',
  'guildMemberAdd',
  'guildMemberChunk',
  'guildMemberRemove',
  'guildMemberUpdate',
  'guildRoleCreate',
  'guildRoleDelete',
  'guildRoleUpdate',
  'guildUnavailable',
  'unavailableGuildCreate',
  'guildUpdate',
  'hello',
  'inviteCreate',
  'inviteDelete',
  'messageCreate',
  'messageDelete',
  'messageReactionRemoveAll',
  'messageReactionRemoveEmoji',
  'messageDeleteBulk',
  'messageReactionAdd',
  'messageReactionRemove',
  'messageUpdate',
  'presenceUpdate',
  'rawREST',
  'rawWS',
  'unknown',
  'relationshipAdd',
  'relationshipRemove',
  'relationshipUpdate',
  'typingStart',
  'userUpdate',
  'voiceChannelJoin',
  'voiceChannelLeave',
  'voiceChannelSwitch',
  'voiceStateUpdate',
  'warn',
  'debug',
  'webhooksUpdate',
  'shardReady',
  'shardResume',
  'shardDisconnect',
  'error'
];

export const PermissionNames: { [perm: string]: string } = {
  'discord.createinstantinvite': 'Create instant invite',
  'discord.kickmembers': 'Kick members',
  'discord.banmembers': 'Ban members',
  'discord.administrator': 'Administrator',
  'discord.managechannels': 'Manage channels',
  'discord.manageguild': 'Manage server',
  'discord.addreactions': 'Add reactions',
  'discord.viewauditlogs': 'View audit log',
  'discord.voicepriorityspeaker': 'Priority speaker',
  'discord.stream': 'Stream',
  'discord.readmessages': 'Read text channels and see voice channels',
  'discord.sendmessages': 'Send messages',
  'discord.sendttsmessages': 'Send TTS messages',
  'discord.managemessages': 'Manage messages',
  'discord.embedlinks': 'Embed links',
  'discord.attachfiles': 'Attach files',
  'discord.readmessagehistory': 'Read message history',
  'discord.mentioneveryone': 'Mention everyone',
  'discord.externalemojis': 'Use external emojis',
  'discord.viewguildinsights': 'View server insights',
  'discord.voiceconnect': 'Connect',
  'discord.voicespeak': 'Speak',
  'discord.voicemutemembers': 'Mute members',
  'discord.voicedeafenmembers': 'Deafen members',
  'discord.voicemovemembers': 'Move members',
  'discord.voiceusevad': 'Use voice activity',
  'discord.changenickname': 'Change nickname',
  'discord.managenicknames': 'Manage nicknames',
  'discord.manageroles': 'Manage roles',
  'discord.managewebhooks': 'Manage webhooks',
  'discord.manageemojis': 'Manage emojis',
  'dexare.nsfwchannel': 'Ran in NSFW channel',
  'dexare.inguild': 'Ran in a Guild',
  'dexare.elevated': 'Bot developer'
};
