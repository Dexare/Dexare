import Eris from 'eris';
import DexareCommand from './modules/commands/command';

/** @hidden */
export type ErisEvents = {
  [K in keyof Eris.ClientEvents]: (...args: Eris.ClientEvents[K]) => void;
};

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
