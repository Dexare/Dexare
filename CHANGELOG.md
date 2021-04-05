# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.2.1] - 2021-02-22
### Fixed:
- Load modules asynchronously in the "load" default command
- Requiring already loaded depenedencies no longer attempts to load it
## [1.2.0] - 2021-02-22
### Changed:
- `CommandContext#reply` now creates a reply rather than appending a mention
  - Previos functionality is moved to `CommandContext#replyMention`
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

[Unreleased]: https://github.com/Dexare/Dexare/compare/v1.2.1...HEAD
[1.0.0]: https://github.com/Dexare/Dexare/releases/tag/v1.0.0
[1.0.1]: https://github.com/Dexare/Dexare/compare/v0.1.0...v1.0.1
[1.1.0]: https://github.com/Dexare/Dexare/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/Dexare/Dexare/compare/v1.1.0...v1.2.0
[1.2.1]: https://github.com/Dexare/Dexare/compare/v1.2.0...v1.2.1
