import { AccountPasswordsService } from './../../../../../shared/src/modules/authentication/account-passwords.service';
import { AuthenticationService } from './../../../../../shared/src/modules/authentication/authentication.service';
import { RequestActor } from './../../../actor/request.actor';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { UserService } from './../../../../../shared/src/modules/user/user.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly passwordsService: AccountPasswordsService,
    private readonly adminService: UserService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('UserActor');
  }
}
