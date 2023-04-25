import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { AuthenticationModule } from './../../../../../shared/src/modules/authentication/authentication.module';
import { UserModule } from './../../../../../shared/src/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserActor } from './user.actor';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule, UserModule, AuthenticationModule, LoggerModule],
  providers: [UserActor],
  controllers: [UserController],
})
export class UserGatewayModule {}
