/**
 * Custom Logger for test automation
 * Provides structured logging with timestamps and log levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private logLevel: LogLevel;
  private prefix: string;

  constructor(prefix: string = '[Framework]', logLevel: LogLevel = LogLevel.INFO) {
    this.prefix = prefix;
    this.logLevel = logLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level}] ${this.prefix} ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMsg = this.formatMessage(LogLevel.DEBUG, message);
      data ? console.debug(formattedMsg, data) : console.debug(formattedMsg);
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMsg = this.formatMessage(LogLevel.INFO, message);
      data ? console.info(formattedMsg, data) : console.info(formattedMsg);
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMsg = this.formatMessage(LogLevel.WARN, message);
      data ? console.warn(formattedMsg, data) : console.warn(formattedMsg);
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMsg = this.formatMessage(LogLevel.ERROR, message);
      if (error instanceof Error) {
        console.error(formattedMsg, error.message);
        console.error(error.stack);
      } else if (error) {
        console.error(formattedMsg, error);
      } else {
        console.error(formattedMsg);
      }
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger('[POM-Framework]', LogLevel.INFO);
