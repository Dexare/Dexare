import DexareClient from '../client';

export default class LoggerHandler<T extends DexareClient<any>> {
  private readonly client: T;
  private readonly module: string;

  constructor(client: T, moduleName: string) {
    this.client = client;
    this.module = moduleName;
  }

  debug(...args: any[]) {
    return this.client.emit('logger', 'debug', this.module, args);
  }

  log(...args: any[]) {
    return this.client.emit('logger', 'debug', this.module, args);
  }

  info(...args: any[]) {
    return this.client.emit('logger', 'info', this.module, args);
  }

  warn(...args: any[]) {
    return this.client.emit('logger', 'warn', this.module, args);
  }

  error(...args: any[]) {
    return this.client.emit('logger', 'error', this.module, args);
  }
}
