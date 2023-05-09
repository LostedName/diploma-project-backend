import { OauthClientModule } from './../../../../../shared/src/modules/oauth/oauth-client/oauth-client.module';
import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { Module } from '@nestjs/common';
import { OauthClientActor } from './oauth-client.actor';
import { OauthClientController } from './oauth-client.controller';

@Module({
  imports: [OauthClientModule, LoggerModule],
  providers: [OauthClientActor],
  controllers: [OauthClientController],
})
export class OauthClientGatewayModule {}
