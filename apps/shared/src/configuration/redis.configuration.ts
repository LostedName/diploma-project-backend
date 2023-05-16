import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { RedisConfigurationError } from '../errors/app-errors';

export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};

export class RedisConfiguration {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  get connectionConfig(): RedisConfig {
    const config = this.getDataFromConfig();

    this.validateConfig(config);

    return { host: config.host, port: config.port, password: config.password };
  }

  get connectionUrl() {
    const config = this.getDataFromConfig();

    this.validateConfig(config);

    return { url: `redis://:${config.password}@${config.host}:${config.port}` };
  }

  private getDataFromConfig(): RedisConfig {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    return { host: redisHost, port: redisPort, password: redisPassword };
  }

  private validateConfig(config: RedisConfig) {
    const isConfigValid =
      config.host === undefined ||
      config.port === undefined ||
      config.password === undefined;
    if (isConfigValid) {
      this.loggerService.error(
        'Redis error: host/port/password not defined in config!',
      );
      throw new RedisConfigurationError();
    }
  }
}
