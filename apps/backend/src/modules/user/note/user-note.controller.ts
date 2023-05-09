import {
  noteReadScope,
  noteScope,
} from './../../../../../shared/src/modules/oauth/scopes/scopes';
import { Scopes } from './../../../guards/oauth.guard';
import { SortQueryExpression } from './../../../../../shared/src/utils/query-expression/expressions/sort-expression';
import { PaginationExpression } from './../../../../../shared/src/utils/query-expression/expressions/pagination-expression';
import { NoteEntity } from './../../../../../shared/src/modules/database/entities/note.entity';
import { RoleGuard } from './../../../guards/role.guard';
import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import {
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserNoteActor } from './user-note.actor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'apps/backend/src/guards/role.guard';
import { NotesListDto, NotesListResponseDto } from './dto/notes-list.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { EditNoteDto } from './dto/edit-note.dto';

//7:22:21 time code

@ApiTags('User notes CRUD')
@ApiBearerAuth()
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
@Controller('api/user/note')
export class UserNoteController {
  constructor(private readonly actor: UserNoteActor) {}

  @ApiOperation({ summary: 'Return notes entities list with pagination' })
  @ApiQuery({
    name: 'pagination__page',
    type: Number,
    required: false,
    description: 'Pagination page number. Starts from 1.',
  })
  @ApiQuery({
    name: 'pagination__pageSize',
    enum: PaginationExpression.supportedLimits,
    required: false,
  })
  @ApiQuery({
    name: 'createdAtBetween__to',
    type: Date,
    required: false,
    description: 'End date',
  })
  @ApiQuery({
    name: 'createdAtBetween__from',
    type: Date,
    required: false,
    description: 'Start date',
  })
  @ApiQuery({
    name: 'id__eq',
    type: Number,
    required: false,
    description: 'Id filter.',
  })
  @ApiQuery({
    name: 'createdAtSort__order',
    enum: SortQueryExpression.supportedSortOrders,
    required: false,
    description: 'Order by created_at.',
  })
  @ApiResponse({
    status: 200,
    type: NotesListResponseDto,
    description: 'Returns list of notes',
  })
  @Scopes(noteScope, noteReadScope)
  @Get('/list')
  async getNotesList(
    @Query() params: NotesListDto,
  ): Promise<NotesListResponseDto> {
    return this.actor.getNotesList(params);
  }

  @ApiOperation({ summary: 'Create new user note' })
  @ApiResponse({
    status: 200,
    type: NoteEntity,
    description: 'Returns new created note',
  })
  @Scopes(noteScope)
  @Post('')
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    return this.actor.createNote(createNoteDto);
  }

  @ApiOperation({ summary: 'Get user note by id' })
  @ApiParam({
    name: 'id',
    description: 'Id of note to be returned',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: NoteEntity,
    description: 'Returns note by id',
  })
  @Scopes(noteScope, noteReadScope)
  @Get('/:id')
  async getNote(@Param('id') noteId: number): Promise<NoteEntity> {
    return this.actor.getNote(noteId);
  }

  @ApiOperation({ summary: 'Update user note by id' })
  @ApiParam({
    name: 'id',
    description: 'Id of note to be updated',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: NoteEntity,
    description: 'Returns updated note',
  })
  @Scopes(noteScope)
  @Patch('/:id')
  async editNote(
    @Param('id') noteId: number,
    @Body() editNoteDto: EditNoteDto,
  ): Promise<NoteEntity> {
    return this.actor.editNote(noteId, editNoteDto);
  }

  @ApiOperation({ summary: 'Delete user note by id' })
  @ApiParam({
    name: 'id',
    description: 'Note id to be deleted',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: NoteEntity,
    description: 'Returns deleted note',
  })
  @Scopes(noteScope)
  @Delete('/:id')
  async deleteNote(@Param('id') noteId: number): Promise<NoteEntity> {
    return this.actor.deleteNote(noteId);
  }
}
