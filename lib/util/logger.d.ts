import DexareClient from '../client';
export default class LoggerHandler<T extends DexareClient<any>> {
    private readonly client;
    private readonly module;
    constructor(client: T, moduleName: string);
    debug(...args: any[]): boolean;
    log(...args: any[]): boolean;
    info(...args: any[]): boolean;
    warn(...args: any[]): boolean;
    error(...args: any[]): boolean;
}
