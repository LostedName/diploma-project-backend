import { Module } from '@nestjs/common';
import { MainDatabaseModule } from '../database/main-database.module';
import { LoggerModule } from '../logging/logger.module';
import { OauthAppService } from './oauth-app.service';

@Module({
  imports: [MainDatabaseModule.entities, LoggerModule],
  providers: [OauthAppService],
  exports: [OauthAppService],
})
export class OauthAppModule {}
