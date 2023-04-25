import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../../../../shared/src/modules/authentication/authentication.module';
import { AdminAuthActor } from './admin-auth.actor';
import { AdminAuthController } from './admin-auth.controller';
import { AuthorisationModule } from '../../../../../shared/src/modules/authorisation/authorisation.module';
import { AdminModule } from '../../../../../shared/src/modules/admin/admin.module';
import { LoggerModule } from '../../../../../shared/src/modules/logging/logger.module';

@Module({
  imports: [
    AuthenticationModule,
    AuthorisationModule,
    AdminModule,
    LoggerModule,
  ],
  providers: [AdminAuthActor],
  controllers: [AdminAuthController],
})
export class AdminAuthGatewayModule {}
