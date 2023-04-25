import { Module } from '@nestjs/common';
import { SystemSettingsModule } from '../../../../shared/src/modules/system-settings/system-settings.module';
import { SystemSettingsActor } from './system-settings.actor';
import { SystemSettingsController } from './system-settings.controller';
import { LoggerModule } from '../../../../shared/src/modules/logging/logger.module';

@Module({
  imports: [SystemSettingsModule, LoggerModule],
  providers: [SystemSettingsActor],
  controllers: [SystemSettingsController],
})
export class SystemSettingsGatewayModule {}
