import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module';
import { AuthenticationService } from './authentication.service';
import { AdminModule } from '../admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { AccountPasswordsService } from './account-passwords.service';
import { MainDatabaseModule } from '../database/main-database.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MainDatabaseModule.entities,
    AdminModule,
    CryptoModule,
  ],
  controllers: [],
  providers: [AuthenticationService, AccountPasswordsService],
  exports: [AuthenticationService, AccountPasswordsService],
})
export class AuthenticationModule {}
