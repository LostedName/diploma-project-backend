import { OauthClientModule } from './../../../../../shared/src/modules/oauth/oauth-client/oauth-client.module';
import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { LinksModule } from './../../../../../shared/src/modules/links/links.module';
import { UserModule } from './../../../../../shared/src/modules/user/user.module';
import { AuthorisationModule } from './../../../../../shared/src/modules/authorisation/authorisation.module';
import { AuthenticationModule } from './../../../../../shared/src/modules/authentication/authentication.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuthActor } from './oauth.actor';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [
    AuthenticationModule,
    AuthorisationModule,
    UserModule,
    ConfigModule,
    LinksModule,
    LoggerModule,
    OauthClientModule,
  ],
  providers: [OAuthActor],
  controllers: [OAuthController],
})
export class OAuthGatewayModule {}
