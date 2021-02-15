# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

[Unreleased]: https://github.com/Snazzah/Dexare/compare/v1.0.1...HEAD
[0.1.0]: https://github.com/Snazzah/slash-create/releases/tag/v1.0.0
[1.0.1]: https://github.com/Snazzah/Dexare/compare/v0.1.0...v1.0.1
