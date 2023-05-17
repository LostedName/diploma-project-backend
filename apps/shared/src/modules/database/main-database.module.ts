import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mainDatabaseConnectionConfigFromConfigService } from './main-database-configuration';
import { AccountEntity } from './entities/account.entity';
import { AdminEntity } from './entities/admin.entity';
import { OauthClientEntity } from './entities/oauth-client.entity';
import { OauthApplicationEntity } from './entities/oauth-application.entity';
import { NoteEntity } from './entities/note.entity';
import { PasswordsEntity } from './entities/passwords.entity';
import { SystemSettingsEntity } from './entities/system-settings.entity';
import { UserEntity } from './entities/user.entity';
import { AuthenticationCodeEntity } from './entities/authentication-code.entity';
import { CredentialEntity } from './entities/credential.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return mainDatabaseConnectionConfigFromConfigService(config);
      },
      inject: [ConfigService],
    }),

    MainDatabaseModule.entities,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainDatabaseModule {
  static get entities() {
    return TypeOrmModule.forFeature([
      AccountEntity,
      AuthenticationCodeEntity,
      CredentialEntity,
      AdminEntity,
      OauthClientEntity,
      OauthApplicationEntity,
      NoteEntity,
      PasswordsEntity,
      SystemSettingsEntity,
      UserEntity,
    ]);
  }
}
