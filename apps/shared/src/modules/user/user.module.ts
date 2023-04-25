import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module';
import { MainDatabaseModule } from '../database/main-database.module';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule, MainDatabaseModule.entities],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
