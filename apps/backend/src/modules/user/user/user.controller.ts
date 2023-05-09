import {
  userFullScope,
  userReadScope,
} from './../../../../../shared/src/modules/oauth/scopes/scopes';
import { UserEntity } from './../../../../../shared/src/modules/database/entities/user.entity';
import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from './../../../guards/role.guard';
import { Controller, UseGuards, Get, Patch, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserActor } from './user.actor';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { Scopes } from 'apps/backend/src/guards/oauth.guard';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@ApiTags('User CRUD')
@ApiBearerAuth()
@Controller('api/user')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly actor: UserActor) {}

  @ApiOperation({ summary: 'Get user profile info' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Returns user profile info',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Scopes(userReadScope)
  @Get('')
  async getProfile(): Promise<UserEntity> {
    return await this.actor.getUserProfile();
  }

  @ApiOperation({ summary: 'Update user profile info' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Return updated user',
  })
  @ApiBody({ type: UpdateUserProfileDto, required: true })
  @Scopes(userFullScope)
  @Patch('')
  async updateProfile(@Body() body: UpdateUserProfileDto): Promise<UserEntity> {
    return await this.actor.updateUserProfile(body);
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Return updated user',
  })
  @ApiResponse({
    status: 401,
    description: 'Old password does not match',
  })
  @ApiBody({ type: UpdateUserPasswordDto, required: true })
  @Patch('password')
  async updateUserPassword(
    @Body() body: UpdateUserPasswordDto,
  ): Promise<UserEntity> {
    return await this.actor.updateUserPassword(body);
  }
}
