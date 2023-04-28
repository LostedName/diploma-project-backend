import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import { RoleGuard, Roles } from './../../../guards/role.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OauthClientActor } from './oauth-client.actor';

@ApiTags('Oauth client CRUD')
@ApiBearerAuth()
@Controller('api/user/oauth-client')
@Roles(AccountRole.User)
@UseGuards(RoleGuard)
export class OauthClientController {
  constructor(private readonly actor: OauthClientActor) {}
}
