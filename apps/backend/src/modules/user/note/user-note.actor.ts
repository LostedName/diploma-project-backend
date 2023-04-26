import { NoteEntity } from './../../../../../shared/src/modules/database/entities/note.entity';
import { NoteService } from './../../../../../shared/src/modules/note/note.service';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { RequestActor } from './../../../actor/request.actor';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { NotesListDto, NotesListResponseDto } from './dto/notes-list.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { EditNoteDto } from './dto/edit-note.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserNoteActor extends RequestActor {
  private readonly logger: LoggerService;

  constructor(private readonly noteService: NoteService, logger: AppLogger) {
    super();
    this.logger = logger.withContext('UserNoteActor');
  }

  async getNotesList(params: NotesListDto): Promise<NotesListResponseDto> {
    const user = this.loadUserIdentity();
    return await this.noteService.getUserNotesList(user.id, params);
  }

  async getNote(noteId: number): Promise<NoteEntity> {
    const user = this.loadUserIdentity();
    return await this.noteService.getUserNoteById(user.id, noteId);
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    const user = this.loadUserIdentity();
    return await this.noteService.createUserNote(user.id, createNoteDto);
  }

  async editNote(
    noteId: number,
    editNoteDto: EditNoteDto,
  ): Promise<NoteEntity> {
    const user = this.loadUserIdentity();
    return await this.noteService.editUserNote(user.id, noteId, editNoteDto);
  }

  async deleteNote(noteId: number): Promise<NoteEntity> {
    const user = this.loadUserIdentity();
    return await this.noteService.deleteUserNote(user.id, noteId);
  }

  private loadUserIdentity() {
    const user = this.requestIdentity.user;
    return user;
  }
}
