import { OauthClientService } from './../../../../../shared/src/modules/oauth/oauth-client/oauth-client.service';
import { OauthClientEntity } from './../../../../../shared/src/modules/database/entities/oauth-client.entity';
import { RequestActor } from '../../../../../shared/src/actor/request.actor';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { CreateOauthClientDto } from './dto/create-oauth-client.dto';
import { EditOauthClientDto } from './dto/edit-oauth-client.dto';
import {
  OauthClientsListDto,
  OauthClientsListResponseDto,
} from './dto/oauth-clients-list.dto';

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

  async getOauthClientsList(
    params: OauthClientsListDto,
  ): Promise<OauthClientsListResponseDto> {
    const user = this.loadUserIdentity();
    return await this.oauthClientService.getUserOauthClientsList(
      user.id,
      params,
    );
  }

  async createOauthClient(
    createOauthClientDto: CreateOauthClientDto,
  ): Promise<OauthClientEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthClientService.createUserOauthClient(
      user.id,
      createOauthClientDto,
    );
  }

  async getOauthClient(clientId: number): Promise<OauthClientEntity> {
    const user = this.loadUserIdentity();
    const oauthClient = await this.oauthClientService.getUserOauthClientById(
      user.id,
      clientId,
    );
    delete oauthClient.client_secret;
    return oauthClient;
  }

  async deleteOauthClient(clientId: number): Promise<OauthClientEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthClientService.deleteUserOauthClient(
      user.id,
      clientId,
    );
  }

  async editOauthClient(
    clientId: number,
    editOauthClientDto: EditOauthClientDto,
  ): Promise<OauthClientEntity> {
    const user = this.loadUserIdentity();
    return await this.oauthClientService.editUserOauthClient(
      user.id,
      clientId,
      editOauthClientDto,
    );
  }

  async generateNewClientSecret(clientId: number) {
    const user = this.loadUserIdentity();
    return await this.oauthClientService.generateNewClientSecret(
      user.id,
      clientId,
    );
  }

  private loadUserIdentity() {
    const user = this.requestIdentity.user;
    return user;
  }
}
