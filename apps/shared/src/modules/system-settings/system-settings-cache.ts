import { SystemSettingsEntity } from '../database/entities/system-settings.entity';

export const cacheTime = 300000;

interface ISystemSettingsCache {
  cachedSettings: SystemSettingsEntity | null;
  cacheDate: Date | null;
}

export const SystemSettingsCache: ISystemSettingsCache = {
  cachedSettings: null,
  cacheDate: null,
};
