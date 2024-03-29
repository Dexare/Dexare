export const ErisEventNames = [
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
  'debug',
  'disconnect',
  'error',
  'friendSuggestionCreate',
  'friendSuggestionDelete',
  'guildAvailable',
  'guildBanAdd',
  'guildBanRemove',
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
  'guildStickersUpdate',
  'guildUnavailable',
  'guildUpdate',
  'hello',
  'interactionCreate',
  'inviteCreate',
  'inviteDelete',
  'messageCreate',
  'messageDelete',
  'messageDeleteBulk',
  'messageReactionAdd',
  'messageReactionRemove',
  'messageReactionRemoveAll',
  'messageReactionRemoveEmoji',
  'messageUpdate',
  'presenceUpdate',
  'rawREST',
  'rawWS',
  'ready',
  'relationshipAdd',
  'relationshipRemove',
  'relationshipUpdate',
  'shardPreReady',
  'stageInstanceCreate',
  'stageInstanceDelete',
  'stageInstanceUpdate',
  'threadCreate',
  'threadDelete',
  'threadListSync',
  'threadMembersUpdate',
  'threadMemberUpdate',
  'threadUpdate',
  'typingStart',
  'unavailableGuildCreate',
  'unknown',
  'userUpdate',
  'voiceChannelJoin',
  'voiceChannelLeave',
  'voiceChannelSwitch',
  'voiceStateUpdate',
  'warn',
  'webhooksUpdate',
  'shardDisconnect',
  'shardReady',
  'shardResume'
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
