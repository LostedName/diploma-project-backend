import { AppLogger } from '../../../../../shared/src/modules/logging/logger.service';
import { AdminService } from '../../../../../shared/src/modules/admin/admin.service';
import { AccountPasswordsService } from '../../../../../shared/src/modules/authentication/account-passwords.service';
import { AuthenticationService } from '../../../../../shared/src/modules/authentication/authentication.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { RequestActor } from '../../../actor/request.actor';

@Injectable({ scope: Scope.REQUEST })
export class AdminActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly passwordsService: AccountPasswordsService,
    private readonly adminService: AdminService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('AdminActor');
  }
}
