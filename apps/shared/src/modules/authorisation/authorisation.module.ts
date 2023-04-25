import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module';
import { AuthorisationService } from './authorisation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SystemSettingsModule } from '../system-settings/system-settings.module';

@Module({
  imports: [
    LoggerModule,
    SystemSettingsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          // secret: config.get<string>('JWT_SECRET_KEY')
          secret: '123123',
        };
      },
    }),
  ],
  controllers: [],
  providers: [AuthorisationService],
  exports: [AuthorisationService],
})
export class AuthorisationModule {}
