import { Injectable, OnModuleDestroy, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as IORedis from 'ioredis';
import { RedisConfiguration } from '../../configuration/redis.configuration';
import { AppLogger } from '../logging/logger.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly logger: LoggerService;
  protected _instance: IORedis.Redis = null;

  constructor(
    private readonly configService: ConfigService,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('RedisService');
    const { host, port, password } = new RedisConfiguration(
      this.configService,
      this.logger,
    ).connectionConfig;

    this._instance = new IORedis.Redis(port, host, { password });
  }

  async get(key: string): Promise<string> {
    return await this._instance.get(key);
  }

  async set(
    key: string,
    value: string | number | Buffer,
    ttl?: number,
  ): Promise<'OK'> {
    await this._instance.set(key, value);
    if (ttl) {
      await this._instance.expire(key, ttl);
    }
    return 'OK';
  }

  client() {
    return this._instance;
  }

  onModuleDestroy(): void {
    this._instance.disconnect();
    this._instance = null;
  }
}
