import { AuthorisationModule } from './../../../../../shared/src/modules/authorisation/authorisation.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserAuthActor } from './auth.actor';
import { UserAuthController } from './auth.controller';
import { MainDatabaseModule } from 'apps/shared/src/modules/database/main-database.module';
import { UserModule } from 'apps/shared/src/modules/user/user.module';
import { MailModule } from 'apps/shared/src/modules/mail/mail.module';
import { AuthModule } from 'apps/shared/src/modules/auth/auth.module';

@Module({
  imports: [MainDatabaseModule.entities, ConfigModule, UserModule, MailModule, AuthModule, AuthorisationModule],
  providers: [UserAuthActor],
  controllers: [UserAuthController],
})
export class UserAuthGatewayModule {}
