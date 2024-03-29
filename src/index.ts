import DexareClient from './client';
import EventRegistry from './client/events';
import PermissionRegistry from './client/permissions';
import CollectorModule from './modules/collector';
import Collector from './modules/collector/collector';
import MessageCollector from './modules/collector/message';
import CommandsModule from './modules/commands';
import DexareCommand from './modules/commands/command';
import CommandContext from './modules/commands/context';
import ArgumentInterpreter from './modules/commands/interpreter';
import DexareModule from './module';
import LoggerHandler from './util/logger';
import DataManager from './dataManager';
import MemoryDataManager from './dataManagers/memory';
import * as Util from './util';

export {
  DexareClient,
  EventRegistry,
  PermissionRegistry,
  CollectorModule,
  Collector,
  MessageCollector,
  CommandsModule,
  DexareCommand,
  CommandContext,
  ArgumentInterpreter,
  DexareModule,
  LoggerHandler,
  DataManager,
  MemoryDataManager,
  Util
};

export { DexareEvents, BaseConfig } from './client';
export { EventHandlers, EventGroup, ClientEvent } from './client/events';
export { PermissionFunction, DirectMessagePermissions, CorePermissions } from './client/permissions';
export { CollectorOptions, CollectorFilter, ResetTimerOptions } from './modules/collector/collector';
export { AwaitMessagesOptions } from './modules/collector';
export { MessageCollectorOptions, MessageCollectorFilter } from './modules/collector/message';
export { DefaultCommand } from './modules/commands';
export { CommandOptions, ThrottlingOptions } from './modules/commands/command';
export { StringIterator } from './modules/commands/interpreter';
export { ThrottleObject, ThrottleResult } from './dataManager';
export { ErisEventNames, PermissionNames } from './constants';
export { ModuleOptions } from './module';
export { ErisEvents, LoggerExtra, PermissionObject } from './types';

export const VERSION: string = require('../package.json').version;
