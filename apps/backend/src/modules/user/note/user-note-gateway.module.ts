import { NoteModule } from './../../../../../shared/src/modules/note/note.module';
import { LoggerModule } from './../../../../../shared/src/modules/logging/logger.module';
import { Module } from '@nestjs/common';
import { UserNoteActor } from './user-note.actor';
import { UserNoteController } from './user-note.controller';

@Module({
  imports: [LoggerModule, NoteModule],
  providers: [UserNoteActor],
  controllers: [UserNoteController],
})
export class UserNoteGatewayModule {}
