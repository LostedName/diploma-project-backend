import { RoleGuard, Roles } from './../../../guards/role.guard';
import { AccountRole } from './../../../../../shared/src/modules/database/entities/account.entity';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminActor } from './admin.actor';

@ApiTags('Admin CRUD')
@ApiBearerAuth()
@Controller('api/admin/admin')
@Roles(AccountRole.Admin)
@UseGuards(RoleGuard)
export class AdminController {
  constructor(private readonly actor: AdminActor) {}
}
