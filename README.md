<div align="center">

# Dexare
[![NPM version](https://img.shields.io/npm/v/dexare?maxAge=3600)](https://www.npmjs.com/package/dexare) [![NPM downloads](https://img.shields.io/npm/dt/dexare?maxAge=3600)](https://www.npmjs.com/package/dexare) [![ESLint status](https://github.com/Snazzah/Dexare/workflows/ESLint/badge.svg)](https://github.com/Snazzah/Dexare/actions?query=workflow%3A%22ESLint%22) [![discord chat](https://img.shields.io/discord/311027228177727508?logo=discord&logoColor=white)](https://snaz.in/discord)

</div>

Dexare is a Discord bot framework that allows for extensibility. Easily make modules that depend on others or overwrite their functions.

Don't like the built-in features? Make some features yourself! With the module system, you can make sure your handler is used before or after others, and also skip other handlers if needed.

> Documentation has not been created yet, coming soon!

## Features
- **Eventful** - hook into events easily and cancel other module's handlers
- **Modular** - load modules and depend on others
- **Permissions** - define custom permissions along with permissions given by Discord
- **Typed** - built with TypeScript, the framework works well with typed classes and environments
- **Commands** - built-in command handler that is extendable and customizable

## Notes
- This module serves as a backbone for any future projects. The core features may not suit your needs. but thats what the modules are for!
- You can use `client.logToConsole()` to push logs to console, but you can also make a logging module and listen to the `logger` event.
