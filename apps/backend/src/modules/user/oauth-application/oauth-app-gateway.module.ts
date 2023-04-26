import { OauthAppModule } from './../../../../../shared/src/modules/oauth-application/oauth-app.module';
import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { Module } from '@nestjs/common';
import { OauthAppActor } from './oauth-app.actor';
import { OauthAppController } from './oauth-app.controller';

@Module({
  imports: [OauthAppModule, LoggerModule],
  providers: [OauthAppActor],
  controllers: [OauthAppController],
})
export class OauthAppGatewayModule {}
