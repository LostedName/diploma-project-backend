import { SystemSettingsEntity } from './../../../../shared/src/modules/database/entities/system-settings.entity';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { RequestActor } from '../../actor/request.actor';
import { SystemSettingsService } from '../../../../shared/src/modules/system-settings/system-settings.service';
import { AppLogger } from '../../../../shared/src/modules/logging/logger.service';
import { isNil } from 'lodash';
import { SystemSettingsNotFound } from '../../errors/app-errors';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';
import { DefaultSystemSettings } from '../../../../shared/src/modules/system-settings/default-system-settings';

@Injectable({ scope: Scope.REQUEST })
export class SystemSettingsActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly systemSettingsService: SystemSettingsService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('SystemSettingsActor');
  }

  async getSystemSettings(): Promise<SystemSettingsEntity> {
    const settings = await this.systemSettingsService.findSystemSettings();

    if (isNil(settings)) {
      return DefaultSystemSettings;
    }

    return settings;
  }

  async updateSystemSettings(
    updateData: UpdateSystemSettingsDto,
  ): Promise<SystemSettingsEntity> {
    const systemSettings =
      await this.systemSettingsService.findSystemSettings();

    if (isNil(systemSettings)) {
      throw new SystemSettingsNotFound();
    }

    return await this.systemSettingsService.updateSystemSettings(
      systemSettings,
      updateData,
    );
  }
}
