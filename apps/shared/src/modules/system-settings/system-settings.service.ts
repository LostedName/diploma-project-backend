import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UpdateSystemSettingsDto } from '../../../../backend/src/modules/settings/dto/update-system-settings.dto';
import { cacheTime, SystemSettingsCache } from './system-settings-cache';
import { isNil } from 'lodash';
import { DefaultSystemSettings } from './default-system-settings';
import { SystemSettingsEntity } from '../database/entities/system-settings.entity';

export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSettingsEntity)
    private systemSettingsRepository: Repository<SystemSettingsEntity>,
  ) {}

  cacheSystemSettings(systemSettings: SystemSettingsEntity): void {
    SystemSettingsCache.cachedSettings = systemSettings;
    SystemSettingsCache.cacheDate = new Date();
  }

  async findSystemSettings(): Promise<SystemSettingsEntity> {
    const systemSettings = await this.systemSettingsRepository.findOne({
      where: { id: Not(IsNull()) },
    });

    if (!isNil(systemSettings)) {
      this.cacheSystemSettings(systemSettings);
    }

    return systemSettings;
  }

  async getCachedSystemSettings(): Promise<SystemSettingsEntity> {
    const { cachedSettings, cacheDate } = SystemSettingsCache;

    if (
      isNil(cachedSettings) ||
      isNil(cachedSettings) ||
      Date.now() > cacheDate.getTime() + cacheTime
    ) {
      const systemSettings = await this.findSystemSettings();
      if (isNil(systemSettings)) {
        return DefaultSystemSettings;
      }
      this.cacheSystemSettings(systemSettings);
      return systemSettings;
    }

    return cachedSettings;
  }

  async updateSystemSettings(
    systemSettingsEntity: SystemSettingsEntity,
    updateData: UpdateSystemSettingsDto,
  ) {
    systemSettingsEntity = await this.systemSettingsRepository.merge(
      systemSettingsEntity,
      updateData,
    );

    const updatedSettings = await this.systemSettingsRepository.save(
      systemSettingsEntity,
    );

    this.cacheSystemSettings(updatedSettings);
    return updatedSettings;
  }
}
