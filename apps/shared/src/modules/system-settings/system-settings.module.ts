import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SystemSettingsService } from './system-settings.service';
import { MainDatabaseModule } from '../database/main-database.module';

@Module({
  imports: [ConfigModule, MainDatabaseModule.entities],
  controllers: [],
  providers: [SystemSettingsService],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
