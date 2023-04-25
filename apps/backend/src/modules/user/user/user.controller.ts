import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from './../../../guards/role.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserActor } from './user.actor';

@ApiTags('User CRUD')
@ApiBearerAuth()
@Controller('api/user/user')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly actor: UserActor) {}
}
