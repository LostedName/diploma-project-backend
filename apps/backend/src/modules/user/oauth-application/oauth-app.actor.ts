import { OauthApplicationEntity } from './../../../../../shared/src/modules/database/entities/oauth-application.entity';
import { OauthAppService } from '../../../../../shared/src/modules/oauth/oauth-application/oauth-app.service';
import { RequestActor } from '../../../../../shared/src/actor/request.actor';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import {
  OauthAppsListDto,
  OauthAppsListResponseDto,
} from './dto/oauth-apps-list.dto';
import { CreateOauthAppDto } from './dto/create-oauth-app.dto';
import { EditOauthAppDto } from './dto/edit-oauth-app.dto';

@Injectable({ scope: Scope.REQUEST })
export class OauthAppActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly oauthAppService: OauthAppService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('OauthAppActor');
  }

  async getOauthAppsList(
    params: OauthAppsListDto,
  ): Promise<OauthAppsListResponseDto> {
    const user = this.loadUserIdentity();
    return await this.oauthAppService.getUserOauthAppsList(user.id, params);
  }

  async getOauthApp(appId: number): Promise<OauthApplicationEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthAppService.getUserOauthAppById(user.id, appId);
  }

  async createOauthApp(
    createOauthAppDto: CreateOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthAppService.createUserOauthApp(
      user.id,
      createOauthAppDto,
    );
  }

  async editOauthApp(
    appId: number,
    editOauthAppDto: EditOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthAppService.editUserOauthApp(
      user.id,
      appId,
      editOauthAppDto,
    );
  }

  async deleteOauthApp(appId: number): Promise<OauthApplicationEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthAppService.deleteUserOauthApp(user.id, appId);
  }

  private loadUserIdentity() {
    const user = this.requestIdentity.user;
    return user;
  }
}
