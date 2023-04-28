import { OauthClientService } from './../../../../../shared/src/modules/oauth-client/oauth-client.service';
import { RequestActor } from './../../../actor/request.actor';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class OauthClientActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly oauthClientService: OauthClientService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('OauthClientActor');
  }
}
