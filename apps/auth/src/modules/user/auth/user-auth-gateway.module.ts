import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { LinksModule } from './../../../../../shared/src/modules/links/links.module';
import { UserModule } from './../../../../../shared/src/modules/user/user.module';
import { AuthorisationModule } from './../../../../../shared/src/modules/authorisation/authorisation.module';
import { AuthenticationModule } from './../../../../../shared/src/modules/authentication/authentication.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserAuthActor } from './user-auth.actor';
import { UserAuthController } from './user-auth.controller';

@Module({
  imports: [
    AuthenticationModule,
    AuthorisationModule,
    UserModule,
    ConfigModule,
    LinksModule,
    LoggerModule,
  ],
  providers: [UserAuthActor],
  controllers: [UserAuthController],
})
export class UserAuthGatewayModule {}
