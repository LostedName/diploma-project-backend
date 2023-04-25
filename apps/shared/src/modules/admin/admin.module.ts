import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module';
import { AdminService } from './admin.service';
import { MainDatabaseModule } from '../database/main-database.module';

@Module({
  imports: [LoggerModule, MainDatabaseModule.entities],
  controllers: [],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
