import { RemoveOptions, SaveOptions } from 'typeorm';
import { SystemSettingsEntity } from '../database/entities/system-settings.entity';

export const DefaultSystemSettings: SystemSettingsEntity = {
  recover(options: SaveOptions | undefined): Promise<SystemSettingsEntity> {
    return Promise.resolve(undefined);
  },
  remove(options: RemoveOptions | undefined): Promise<SystemSettingsEntity> {
    return Promise.resolve(undefined);
  },
  save(options: SaveOptions | undefined): Promise<SystemSettingsEntity> {
    return Promise.resolve(undefined);
  },
  softRemove(options: SaveOptions | undefined): Promise<SystemSettingsEntity> {
    return Promise.resolve(undefined);
  },
  hasId(): boolean {
    return false;
  },
  reload(): Promise<void> {
    return Promise.resolve(undefined);
  },
  id: 0,
  vat: 17,
  registration_verification_tts_seconds: 3600,
  user_session_duration_seconds: 2592000,
  admin_session_duration_seconds: 28800,
  oauth_session_duration_seconds: 28800,
  oauth_refresh_duration_seconds: 2592000,
  user_allowed_login_attempts: 7,
  admin_allowed_login_attempts: 3,
  two_factor_authentication_ttl_seconds: 600,
  mailing_list: [],
};
