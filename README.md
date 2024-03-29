<div align="center">

<img src="https://get.snaz.in/3aRs11a.png" height="100">

[![NPM version](https://img.shields.io/npm/v/dexare?maxAge=3600?&color=2ed573)](https://www.npmjs.com/package/dexare) [![NPM downloads](https://img.shields.io/npm/dt/dexare?maxAge=3600&color=2ed573)](https://www.npmjs.com/package/dexare) [![ESLint status](https://github.com/Dexare/Dexare/workflows/ESLint/badge.svg)](https://github.com/Dexare/Dexare/actions?query=workflow%3A%22ESLint%22) [![DeepScan grade](https://deepscan.io/api/teams/11596/projects/15945/branches/327753/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11596&pid=15945&bid=327753)

</div>

Dexare is a Discord bot framework that allows for extensibility. Easily make modules that depend on others or overwrite their functions.

Don't like the built-in features? Make some features yourself! With the module system, you can make sure your handler is used before or after others, or skip other handlers if needed. [Documentation for Dexare](https://github.com/Dexare/Dexare/wiki) available.

## Features
- **Eventful** - hook into events easily and cancel other module's handlers
- **Modular** - load modules and depend on others
- **Permissions** - define custom permissions along with permissions given by Discord
- **Typed** - built with TypeScript, the framework works well with typed classes and environments
- **Commands** - built-in command handler that is extendable and customizable

## Notes
- This module serves as a backbone for any future projects. The core features may not suit your needs. but thats what the modules are for!
- You can use `client.logToConsole()` to push logs to console, but you can also make a logging module and listen to the `logger` event.
- Find Dexare modules on NPM [here](https://www.npmjs.com/search?q=keywords:dexare-module).
