import { merge } from 'lodash';
import { EditNoteDto } from './../../../../backend/src/modules/user/note/dto/edit-note.dto';
import { NoteEntity } from './../database/entities/note.entity';
import { CreateNoteDto } from './../../../../backend/src/modules/user/note/dto/create-note.dto';
import { NoteNotFound } from './../../../../backend/src/errors/app-errors';
import {
  NotesListDto,
  NotesListResponseDto,
} from './../../../../backend/src/modules/user/note/dto/notes-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { UserEntity } from '../database/entities/user.entity';

@Injectable()
export class NoteService {
  readonly logger: LoggerService;

  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('NoteService');
  }

  async getUserNotesList(
    userId: number,
    params: NotesListDto,
  ): Promise<NotesListResponseDto> {
    let queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .innerJoin('notes.user', 'user')
      .where('user.id = :userId', { userId })
      .select(['notes.id', 'notes.title', 'notes.content', 'notes.created_at']);

    queryBuilder = params.filters().apply(queryBuilder);

    const [items, total] = await queryBuilder.getManyAndCount();
    return {
      items: items,
      total: total,
    };
  }
  async getUserNoteById(userId: number, noteId: number): Promise<NoteEntity> {
    const note = await this.findUserNoteById(userId, noteId);
    if (!note) {
      throw new NoteNotFound();
    }
    return note;
  }

  async createUserNote(
    userId: number,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteEntity> {
    const noteEntity = this.createNote(createNoteDto);
    noteEntity.user = <UserEntity>{ id: userId };
    const note = await this.saveNote(noteEntity);
    return await this.findUserNoteById(userId, note.id);
  }

  async editUserNote(
    userId: number,
    noteId: number,
    editNoteDto: EditNoteDto,
  ): Promise<NoteEntity> {
    const noteEntity = await this.findUserNoteById(userId, noteId);
    if (!noteEntity) {
      throw new NoteNotFound();
    }
    const newNoteEntity = merge(noteEntity, editNoteDto);
    const newNote = await this.saveNote(newNoteEntity);
    return await this.findUserNoteById(userId, newNote.id);
  }

  async deleteUserNote(userId: number, noteId: number): Promise<NoteEntity> {
    const noteEntity = await this.findUserNoteById(userId, noteId);
    if (!noteEntity) {
      throw new NoteNotFound();
    }
    await this.deleteNote(noteEntity.id);
    return noteEntity;
  }

  async findUserNoteById(
    userId: number,
    noteId: number,
  ): Promise<NoteEntity | null> {
    return await this.noteRepository
      .createQueryBuilder('notes')
      .innerJoin('notes.user', 'user')
      .where('user.id = :userId and notes.id = :noteId', {
        userId,
        noteId,
      })
      .select(['notes.id', 'notes.title', 'notes.content', 'notes.created_at'])
      .getOne();
  }

  private createNote(note: Partial<NoteEntity>) {
    return this.noteRepository.create(note);
  }

  private saveNote(note: NoteEntity) {
    return this.noteRepository.save(note);
  }

  private async deleteNote(noteId: number) {
    return await this.noteRepository.softDelete(noteId);
  }
}
