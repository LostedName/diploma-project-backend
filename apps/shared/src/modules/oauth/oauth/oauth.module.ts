import { Module } from '@nestjs/common';
import { MainDatabaseModule } from '../../database/main-database.module';
import { LoggerModule } from '../../logging/logger.module';
import { OauthService } from './oauth.service';
import { RedisModule } from '../../redis/redis.module';
import { OauthClientModule } from '../oauth-client/oauth-client.module';

@Module({
  imports: [MainDatabaseModule.entities, LoggerModule, RedisModule, OauthClientModule],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
