import { SortQueryExpression } from './../../../../../shared/src/utils/query-expression/expressions/sort-expression';
import { PaginationExpression } from './../../../../../shared/src/utils/query-expression/expressions/pagination-expression';
import { OauthClientEntity } from '../../../../../shared/src/modules/database/entities/oauth-client.entity';
import { AccountRole } from '../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from '../../../guards/role.guard';
import { Body, Controller, Post, UseGuards, Patch, Delete, Param, Query, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OauthClientActor } from './oauth-client.actor';
import { CreateOauthClientDto } from './dto/create-oauth-client.dto';
import { EditOauthClientDto } from './dto/edit-oauth-client.dto';
import { GetOauthClientParamsDto } from './dto/get-oauth-client.dto';
import { OauthClientsListDto, OauthClientsListResponseDto } from './dto/oauth-clients-list.dto';

@ApiTags('Oauth client CRUD')
@ApiBearerAuth()
@Controller('api/user/oauth-client')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class OauthClientController {
  constructor(private readonly actor: OauthClientActor) {}

  @ApiOperation({ summary: 'Return clients entities list with pagination' })
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
    type: OauthClientsListResponseDto,
    description: 'Returns list of notes',
  })
  @Get('/list')
  async getNotesList(@Query() params: OauthClientsListDto): Promise<OauthClientsListResponseDto> {
    return this.actor.getOauthClientsList(params);
  }

  @ApiOperation({ summary: 'Create new user oauth client credentials' })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns new created oauth client credentials',
  })
  @Post('')
  async createOauthClient(@Body() createOauthClientDto: CreateOauthClientDto): Promise<OauthClientEntity> {
    return this.actor.createOauthClient(createOauthClientDto);
  }

  @ApiOperation({ summary: 'Get user oauth client by id' })
  @ApiParam({
    name: 'clientId',
    description: 'Id of oauth client to be returned',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns oauth client by id',
  })
  @Get('/:clientId')
  async getOauthClient(@Param() params: GetOauthClientParamsDto): Promise<OauthClientEntity> {
    return this.actor.getOauthClient(params.clientId);
  }

  @ApiOperation({ summary: 'Delete user oauth client by id' })
  @ApiParam({
    name: 'clientId',
    description: 'Oauth client id to be deleted',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns deleted oauth client',
  })
  @Delete('/:clientId')
  async deleteOauthClient(@Param() params: GetOauthClientParamsDto): Promise<OauthClientEntity> {
    return this.actor.deleteOauthClient(params.clientId);
  }

  @ApiOperation({ summary: 'Update user oauth client by id' })
  @ApiParam({
    name: 'clientId',
    description: 'Id of oauth client to be updated',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns updated oauth client',
  })
  @Patch('/:clientId')
  async editOauthClient(
    @Param() params: GetOauthClientParamsDto,
    @Body() editOauthClientDto: EditOauthClientDto,
  ): Promise<OauthClientEntity> {
    return this.actor.editOauthClient(params.clientId, editOauthClientDto);
  }

  @ApiOperation({ summary: 'Generate new user oauth client secret' })
  @ApiParam({
    name: 'clientId',
    description: 'Id of oauth client to be updated',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns updated oauth client',
  })
  @Get('/generate-client/:clientId')
  async generateNewOauthClientSecret(@Param() params: GetOauthClientParamsDto): Promise<OauthClientEntity> {
    return this.actor.generateNewClientSecret(params.clientId);
  }
}
