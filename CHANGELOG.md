# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [2.2.4] - 2022-03-25
### Fixed:
- Set eris dependency to a specific commit to fix https://github.com/abalabahaha/eris/pull/1334
## [2.2.3] - 2022-02-19
### Fixed:
- Fixed deprecated method of sending replies
## [2.2.2] - 2022-01-28
### Fixed:
- Fixed eris event names in constants
## [2.2.1] - 2022-01-28
### Fixed:
- Fixed the client being too strict while registering commands/data managers/modules
## [2.2.0] - 2022-01-28
### Changed:
- Updated Eris to v0.16.1, amongst other dependencies
## [2.1.0] - 2021-07-18
### Changed:
- You can now predefine the Eris client when creating a Dexare client
### Added:
- `afterConnect` and `afterDisconnect` events
## [2.0.1] - 2021-06-02
### Fixed:
- Discord permissions within the client
## [2.0.0] - 2021-06-02
### Changed:
- Default command `load` can now load from packages by prepending `~` (ex. `~@dexare/logger`)
- **[BREAKING]** Command throttle functionality has changed
- **[BREAKING]** Permissions now use permission objects rather than either user/member/message
### Added:
- Data managers (`client.data`), defaults to memory data manager
  - Accessible with `client.data`, can be extended from `DataManager` and loaded with `DexareClient#loadDataManager`
- New exports: `PermissionObject`, `ThrottleObject`, `ThrottleResult`
## [1.3.1] - 2021-04-05
### Fixed:
- Fixed client prefixing with read-only configs
## [1.3.0] - 2021-04-05
### Changed:
- Dexare will automatically prepend `Bot` to the token if not there already
- Dexare now uses Eris 0.15.0
### Added:
- Dexare will ensure the member within the message if ran within guilds
- 'commands/spacedPrefix' event variable in commands module
### Fixed:
- Unnessesary mention in default ping command
- Parsing within the default help command
## [1.2.1] - 2021-02-22
### Fixed:
- Load modules asynchronously in the "load" default command
- Requiring already loaded depenedencies no longer attempts to load it
- Appending mentions in `ctx.reply`
## [1.2.0] - 2021-02-22
### Changed:
- `CommandContext#reply` now creates a reply rather than appending a mention
  - Previous functionality is moved to `CommandContext#replyMention`
### Added:
- `DexareClient#loadModule`
- `DexareClient#loadModulesAsync`
- Added usage metadata to default commands
- `CommandContext#replyMention`
- 'load', 'unload' and 'reload' default commands
### Fixed:
- Fixed core permission registering
- Loading modules with dependencies are fixed
## [1.1.0] - 2021-02-16
### Changed:
- CommandsModule: `info` logs are now `debug`
- EventRegistry: `eventGroups` and `client` is no-longer privated
### Added:
- `DexareClient#unloadModule`
- Modules can have a description in their options
- Modules can define their file path in their constructor
- Some logs when loading/unloading modules
- `beforeConnect` and `beforeDisconnect` events
- `exec` and `kill` default commands
### Fixed:
- Registering commands in a folder
- Added missing values in logging eris events
- Fixed the default eval command
- DexareClient not loading the collector module
## [1.0.1] - 2021-02-15
### Changed:
- `DexareClient#logToConsole`: No longer has the `includeErisEvents` argument in favor of `DexareClient#logErisEvents`
### Added:
- `DexareClient#logErisEvents`
- More JSDoc stuff.
- `BaseConfig` is in the index.
### Fixed:
- `CommandContext#reply`: Mentions only are prepended in guild channels.
- `DexareClient#loadModules`: Whoops.
## [1.0.0] - 2021-02-13
- Initial release.

[Unreleased]: https://github.com/Dexare/Dexare/compare/v2.2.4...HEAD
[1.0.0]: https://github.com/Dexare/Dexare/releases/tag/v1.0.0
[1.0.1]: https://github.com/Dexare/Dexare/compare/v0.1.0...v1.0.1
[1.1.0]: https://github.com/Dexare/Dexare/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/Dexare/Dexare/compare/v1.1.0...v1.2.0
[1.2.1]: https://github.com/Dexare/Dexare/compare/v1.2.0...v1.2.1
[1.3.0]: https://github.com/Dexare/Dexare/compare/v1.2.1...v1.3.0
[1.3.1]: https://github.com/Dexare/Dexare/compare/v1.3.0...v1.3.1
[2.0.0]: https://github.com/Dexare/Dexare/compare/v1.3.1...v2.0.0
[2.0.1]: https://github.com/Dexare/Dexare/compare/v2.0.0...v2.0.1
[2.1.0]: https://github.com/Dexare/Dexare/compare/v2.0.1...v2.1.0
[2.2.0]: https://github.com/Dexare/Dexare/compare/v2.1.0...v2.2.0
[2.2.1]: https://github.com/Dexare/Dexare/compare/v2.2.0...v2.2.1
[2.2.2]: https://github.com/Dexare/Dexare/compare/v2.2.1...v2.2.2
[2.2.3]: https://github.com/Dexare/Dexare/compare/v2.2.2...v2.2.3
[2.2.4]: https://github.com/Dexare/Dexare/compare/v2.2.3...v2.2.4
