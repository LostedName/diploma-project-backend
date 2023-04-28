import { Module } from '@nestjs/common';
import { MainDatabaseModule } from '../database/main-database.module';
import { LoggerModule } from '../logging/logger.module';
import { OauthClientService } from './oauth-client.service';

@Module({
  imports: [MainDatabaseModule.entities, LoggerModule],
  providers: [OauthClientService],
  exports: [OauthClientService],
})
export class OauthClientModule {}
