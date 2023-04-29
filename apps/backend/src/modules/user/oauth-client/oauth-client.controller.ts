import { OauthClientEntity } from '../../../../../shared/src/modules/database/entities/oauth-client.entity';
import { AccountRole } from '../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from '../../../guards/role.guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OauthClientActor } from './oauth-client.actor';
import { CreateOauthClientDto } from './dto/create-oauth-client.dto';
import { EditOauthClientDto } from './dto/edit-oauth-client.dto';
import { GetOauthClientParamsDto } from './dto/get-oauth-client.dto';

@ApiTags('Oauth client CRUD')
@ApiBearerAuth()
@Controller('api/user/oauth-client')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class OauthClientController {
  constructor(private readonly actor: OauthClientActor) {}

  @ApiOperation({ summary: 'Create new user oauth client credentials' })
  @ApiResponse({
    status: 200,
    type: OauthClientEntity,
    description: 'Returns new created oauth client credentials',
  })
  @Post('')
  async createOauthClient(
    @Body() createOauthClientDto: CreateOauthClientDto,
  ): Promise<OauthClientEntity> {
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
  async getOauthClient(
    @Param() params: GetOauthClientParamsDto,
  ): Promise<OauthClientEntity> {
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
  async deleteOauthClient(
    @Param() params: GetOauthClientParamsDto,
  ): Promise<OauthClientEntity> {
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
}
