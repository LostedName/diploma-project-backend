import { SortQueryExpression } from './../../../../../shared/src/utils/query-expression/expressions/sort-expression';
import { PaginationExpression } from './../../../../../shared/src/utils/query-expression/expressions/pagination-expression';
import { OauthApplicationEntity } from './../../../../../shared/src/modules/database/entities/oauth-application.entity';
import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from './../../../guards/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OauthAppActor } from './oauth-app.actor';
import {
  OauthAppsListDto,
  OauthAppsListResponseDto,
} from './dto/oauth-apps-list.dto';
import { CreateOauthAppDto } from './dto/create-oauth-app.dto';
import { EditOauthAppDto } from './dto/edit-oauth-app.dto';

@ApiTags('Oauth application CRUD')
@ApiBearerAuth()
@Controller('api/user/oauth-app')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class OauthAppController {
  constructor(private readonly actor: OauthAppActor) {}

  @ApiOperation({
    summary: 'Return oauth application entities list with pagination',
  })
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
    type: OauthAppsListResponseDto,
    description: 'Returns list of oauth applications',
  })
  @Get('/list')
  async getOauthAppsList(
    @Query() params: OauthAppsListDto,
  ): Promise<OauthAppsListResponseDto> {
    return this.actor.getOauthAppsList(params);
  }

  @ApiOperation({ summary: 'Create new user oauth application' })
  @ApiResponse({
    status: 200,
    type: OauthApplicationEntity,
    description: 'Returns new created oauth application',
  })
  @Post('')
  async createOauthApp(
    @Body() createOauthAppDto: CreateOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    return this.actor.createOauthApp(createOauthAppDto);
  }

  @ApiOperation({ summary: 'Get user oauth application by id' })
  @ApiParam({
    name: 'id',
    description: 'Id of oauth application to be returned',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthApplicationEntity,
    description: 'Returns oauth application by id',
  })
  @Get('/:id')
  async getOauthApp(
    @Param('id') appId: number,
  ): Promise<OauthApplicationEntity> {
    return this.actor.getOauthApp(appId);
  }

  @ApiOperation({ summary: 'Update user oauth application by id' })
  @ApiParam({
    name: 'id',
    description: 'Id of oauth application to be updated',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthApplicationEntity,
    description: 'Returns updated oauth application',
  })
  @Patch('/:id')
  async editOauthApp(
    @Param('id') appId: number,
    @Body() editOauthAppDto: EditOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    return this.actor.editOauthApp(appId, editOauthAppDto);
  }

  @ApiOperation({ summary: 'Delete user oauth application by id' })
  @ApiParam({
    name: 'id',
    description: 'Oauth application id to be deleted',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OauthApplicationEntity,
    description: 'Returns deleted oauth application',
  })
  @Delete('/:id')
  async deleteOauthApp(
    @Param('id') appId: number,
  ): Promise<OauthApplicationEntity> {
    return this.actor.deleteOauthApp(appId);
  }
}
