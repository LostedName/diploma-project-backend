import { SystemSettingsEntity } from './../../../../shared/src/modules/database/entities/system-settings.entity';
import { AccountRole } from './../../../../shared/src/modules/database/entities/account.entity';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SystemSettingsActor } from './system-settings.actor';
import { Roles } from '../../guards/role.guard';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorisedGuard } from '../../guards/authorised.guard';

@ApiTags('System settings')
@UseGuards(AuthorisedGuard)
@Roles(AccountRole.Admin)
@Controller('api/settings')
export class SystemSettingsController {
  constructor(private readonly actor: SystemSettingsActor) {}

  @ApiResponse({
    type: SystemSettingsEntity,
    description:
      'Returns settings, if no settings found returns default settings',
  })
  @Get()
  getSystemSettings(): Promise<SystemSettingsEntity> {
    return this.actor.getSystemSettings();
  }

  @ApiResponse({
    type: SystemSettingsEntity,
    description: 'Returns updated settings if ok',
  })
  @ApiBody({ type: UpdateSystemSettingsDto })
  @Patch()
  updateSystemSettings(
    @Body() updateData: UpdateSystemSettingsDto,
  ): Promise<SystemSettingsEntity> {
    return this.actor.updateSystemSettings(updateData);
  }
}
