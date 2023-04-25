import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminActor } from './admin.actor';
import { AdminController } from './admin.controller';
import { AdminModule } from '../../../../../shared/src/modules/admin/admin.module';
import { LoggerModule } from '../../../../../shared/src/modules/logging/logger.module';
import { AuthenticationModule } from '../../../../../shared/src/modules/authentication/authentication.module';

@Module({
  imports: [ConfigModule, AdminModule, AuthenticationModule, LoggerModule],
  providers: [AdminActor],
  controllers: [AdminController],
})
export class AdminGatewayModule {}
