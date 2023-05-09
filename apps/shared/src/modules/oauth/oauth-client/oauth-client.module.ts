import { Module } from '@nestjs/common';
import { MainDatabaseModule } from '../../database/main-database.module';
import { LoggerModule } from '../../logging/logger.module';
import { OauthClientService } from './oauth-client.service';
import { OauthAppModule } from '../oauth-application/oauth-app.module';

@Module({
  imports: [MainDatabaseModule.entities, OauthAppModule, LoggerModule],
  providers: [OauthClientService],
  exports: [OauthClientService],
})
export class OauthClientModule {}
