import * as winston from 'winston';
import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { consoleFormat } from 'winston-console-format';
import { ConfigService } from '@nestjs/config';

class ContextAppLogger implements LoggerService {
  constructor(private logger: AppLogger, private context: string) {}

  debug(message: any, ...optionalParams: any[]): any {
    optionalParams.unshift(message, this.context);
    this.logger.debug.apply(this.logger, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    optionalParams.unshift(message, this.context);
    this.logger.error.apply(this.logger, optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    optionalParams.unshift(message, this.context);
    this.logger.log.apply(this.logger, optionalParams);
  }

  setLogLevels(levels: LogLevel[]): any {}

  verbose(message: any, ...optionalParams: any[]): any {
    optionalParams.unshift(message, this.context);
    this.logger.verbose.apply(this.logger, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    optionalParams.unshift(message, this.context);
    this.logger.warn.apply(this.logger, optionalParams);
  }
}

@Injectable()
export class AppLogger implements LoggerService {
  private context?: string;

  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const loggerOptions = {
      level: 'silly',
      transports: this.createTransports(),
    };

    this.logger = winston.createLogger(loggerOptions);
  }

  withContext(context: string): LoggerService {
    return new ContextAppLogger(this, context);
  }

  public setContext(context: string) {
    this.context = context;
  }

  private createTransports() {
    const transports = [];
    transports.push(this.createConsoleTransport());

    return transports;
  }

  private createConsoleTransport() {
    const consoleTransportOpts = {
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ['timestamp', 'service'],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        }),
      ),
    };

    return new winston.transports.Console(consoleTransportOpts);
  }

  public log(message: any, context?: string): any {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.info(msg as string, { context, ...meta });
    }

    return this.logger.info(message, { context });
  }

  public error(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.error(msg, {
        context,
        stack: [trace || message.stack],
        ...meta,
      });
    }

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, {
        context,
        stack: [trace],
        ...meta,
      });
    }

    return this.logger.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string): any {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { context, ...meta });
    }

    return this.logger.warn(message, { context });
  }

  public debug?(message: any, context?: string): any {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { context, ...meta });
    }

    return this.logger.debug(message, { context });
  }

  public verbose?(message: any, context?: string): any {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { context, ...meta });
    }

    return this.logger.verbose(message, { context });
  }
}
