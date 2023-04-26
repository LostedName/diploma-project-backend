import { Module } from '@nestjs/common';
import { MainDatabaseModule } from '../database/main-database.module';
import { LoggerModule } from '../logging/logger.module';
import { NoteService } from './note.service';

@Module({
  imports: [MainDatabaseModule.entities, LoggerModule],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
