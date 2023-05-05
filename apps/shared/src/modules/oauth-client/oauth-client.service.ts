import { merge } from 'lodash';
import { EditOauthClientDto } from './../../../../backend/src/modules/user/oauth-client/dto/edit-oauth-client.dto';
import { CreateOauthClientDto } from './../../../../backend/src/modules/user/oauth-client/dto/create-oauth-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { OauthClientEntity } from '../database/entities/oauth-client.entity';
import { OauthAppService } from '../oauth-application/oauth-app.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OauthApplicationEntity } from '../database/entities/oauth-application.entity';
import {
  OauthClientAlreadyExist,
  OauthClientNotFound,
} from '../../errors/app-errors';

@Injectable()
export class OauthClientService {
  readonly logger: LoggerService;

  constructor(
    @InjectRepository(OauthClientEntity)
    private readonly oauthClientRepository: Repository<OauthClientEntity>,
    private readonly aouthAppService: OauthAppService,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('OauthClientService');
  }

  async createUserOauthClient(
    userId: number,
    createOauthClientDto: CreateOauthClientDto,
  ): Promise<OauthClientEntity> {
    createOauthClientDto.applicationId;
    const oauthApp = await this.aouthAppService.getUserOauthAppById(
      userId,
      createOauthClientDto.applicationId,
    );
    const duplicateClient = oauthApp.oauth_clients.find(
      (client) => client.name === createOauthClientDto.name,
    );
    if (duplicateClient) {
      throw new OauthClientAlreadyExist(); //add extra with reason
    }
    const clientPublic = this.generateClientPublic();
    const clientSecret = this.generateClientSecret();
    const hashedClientSecret = await this.encryptClientSecret(clientSecret);
    const oauthClient = this.createOauthClient({
      client_public: clientPublic,
      client_secret: hashedClientSecret,
      oauth_application: <OauthApplicationEntity>{ id: oauthApp.id },
      name: createOauthClientDto.name,
      description: createOauthClientDto.description || null,
      homepage_url: createOauthClientDto.homepageUrl,
      redirect_urls: createOauthClientDto.redirectUrls.join(';'),
    });
    const savedOauthClient = await this.saveOauthClient(oauthClient);
    savedOauthClient.client_secret = clientSecret;
    return savedOauthClient;
  }

  async getUserOauthClientById(
    userId: number,
    clientId: number,
  ): Promise<OauthClientEntity> {
    const oauthClient = await this.findUserOauthClientById(userId, clientId);
    if (!oauthClient) {
      throw new OauthClientNotFound();
    }
    return oauthClient;
  }

  async deleteUserOauthClient(
    userId: number,
    clientId: number,
  ): Promise<OauthClientEntity> {
    const oauthClientEntity = await this.findUserOauthClientById(
      userId,
      clientId,
    );
    if (!oauthClientEntity) {
      throw new OauthClientNotFound();
    }
    await this.deleteOauthClient(oauthClientEntity.id);
    return oauthClientEntity;
  }

  async editUserOauthClient(
    userId: number,
    clientId: number,
    editOauthClientDto: EditOauthClientDto,
  ): Promise<OauthClientEntity> {
    const oauthClientEntity = await this.findUserOauthClientById(
      userId,
      clientId,
    );
    if (!oauthClientEntity) {
      throw new OauthClientNotFound();
    }

    const newOauthClientEntity = merge(oauthClientEntity, {
      name: editOauthClientDto.name,
      description: editOauthClientDto.description,
      homepage_url: editOauthClientDto.homepageUrl,
      redirect_urls: editOauthClientDto.redirectUrls?.join(';'),
      icon_url: editOauthClientDto.iconUrl,
    });

    const newOauthClient = await this.saveOauthClient(newOauthClientEntity);
    return await this.findUserOauthClientById(userId, newOauthClient.id);
  }

  async generateNewClientSecret(userId: number, clientId: number) {
    const oauthClient = await this.findUserOauthClientById(userId, clientId);
    if (!oauthClient) {
      throw new OauthClientNotFound();
    }
    const clientSecret = this.generateClientSecret();
    const hashedClientSecret = await this.encryptClientSecret(clientSecret);

    oauthClient.client_secret = hashedClientSecret;

    const savedOauthClient = await this.saveOauthClient(oauthClient);

    savedOauthClient.client_secret = clientSecret;
    return savedOauthClient;
  }

  async findUserOauthClientById(
    userId: number,
    clientId: number,
  ): Promise<OauthClientEntity | null> {
    return await this.oauthClientRepository
      .createQueryBuilder('oauth_client')
      .innerJoin('oauth_client.oauth_application', 'oauth_app')
      .innerJoin('oauth_app.user', 'user')
      .where('user.id = :userId and oauth_client.id = :clientId', {
        userId,
        clientId,
      })
      .getOne();
  }
  async findUserOauthClientByIdWithSecret(
    userId: number,
    clientId: number,
  ): Promise<OauthClientEntity | null> {
    return await this.oauthClientRepository
      .createQueryBuilder('oauth_client')
      .innerJoin('oauth_client.oauth_application', 'oauth_app')
      .innerJoin('oauth_app.user', 'user')
      .where('user.id = :userId and oauth_client.id = :clientId', {
        userId,
        clientId,
      })
      .addSelect(['oauth_client.client_secret'])
      .getOne();
  }

  private createOauthClient(oauthClient: Partial<OauthClientEntity>) {
    return this.oauthClientRepository.create(oauthClient);
  }

  private saveOauthClient(oauthClient: OauthClientEntity) {
    return this.oauthClientRepository.save(oauthClient);
  }

  private async deleteOauthClient(clientId: number) {
    return await this.oauthClientRepository.softDelete(clientId);
  }

  private generateClientPublic() {
    return `${this.generateRandomHexString(16)}.diplomausercontent.com`;
  }
  private generateClientSecret() {
    return `${this.generateRandomHexString(32)}`;
  }

  private generateRandomHexString(size: number) {
    return crypto.randomBytes(size).toString('hex');
  }

  private async matchClientSecrets(
    clientSecret: string,
    hashedClientSecret: string,
  ): Promise<boolean> {
    return bcrypt.compare(clientSecret, hashedClientSecret);
  }

  private async encryptClientSecret(clientSecret: string): Promise<string> {
    return bcrypt.hash(clientSecret, await bcrypt.genSalt());
  }
}
