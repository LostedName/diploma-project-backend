import { DbUtils } from './../../../utils/database/db-utils';
import {
  OauthClientsListDto,
  OauthClientsListResponseDto,
} from './../../../../../backend/src/modules/user/oauth-client/dto/oauth-clients-list.dto';
import { EditOauthClientDto } from './../../../../../backend/src/modules/user/oauth-client/dto/edit-oauth-client.dto';
import {
  AppError,
  InternalError,
  OauthClientAlreadyExist,
  OauthClientNotFound,
  OauthClientRelationsAreIncorrect,
} from './../../../errors/app-errors';
import { CreateOauthClientDto } from './../../../../../backend/src/modules/user/oauth-client/dto/create-oauth-client.dto';
import { merge } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, LoggerService } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OauthClientEntity } from '../../database/entities/oauth-client.entity';
import { AppLogger } from '../../logging/logger.service';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class OauthClientService {
  readonly logger: LoggerService;

  constructor(
    @InjectRepository(OauthClientEntity)
    private readonly oauthClientRepository: Repository<OauthClientEntity>,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('OauthClientService');
  }

  async getUserOauthClientsList(userId: number, params: OauthClientsListDto): Promise<OauthClientsListResponseDto> {
    let queryBuilder = this.oauthClientRepository
      .createQueryBuilder('oauth_clients')
      .innerJoin('oauth_clients.user', 'user')
      .where('user.id = :userId', { userId })
      .select([
        'oauth_clients.id',
        'oauth_clients.name',
        'oauth_clients.description',
        'oauth_clients.icon_url',
        'oauth_clients.created_at',
        'oauth_clients.updated_at',
      ]);

    queryBuilder = params.filters().apply(queryBuilder);

    const [items, total] = await queryBuilder.getManyAndCount();
    return {
      items: items,
      total: total,
    };
  }

  async createUserOauthClient(userId: number, createOauthClientDto: CreateOauthClientDto): Promise<OauthClientEntity> {
    // error
    const clientPublic = this.generateClientPublic();
    const clientSecret = this.generateClientSecret();
    const hashedClientSecret = await this.encryptClientSecret(clientSecret);
    const oauthClient = this.createOauthClient({
      client_public: clientPublic,
      client_secret: hashedClientSecret,
      user: <UserEntity>{ id: userId },
      name: createOauthClientDto.name,
      description: createOauthClientDto.description || null,
      homepage_url: createOauthClientDto.homepageUrl,
      redirect_uris: createOauthClientDto.redirectUris.join(';'),
    });
    const savedOauthClient = await this.saveOauthClient(oauthClient);
    savedOauthClient.client_secret = clientSecret;
    return savedOauthClient;
  }

  async getUserOauthClientById(userId: number, clientId: number): Promise<OauthClientEntity> {
    const oauthClient = await this.findUserOauthClientById(userId, clientId);
    if (!oauthClient) {
      throw new OauthClientNotFound();
    }
    return oauthClient;
  }

  async deleteUserOauthClient(userId: number, clientId: number): Promise<OauthClientEntity> {
    const oauthClientEntity = await this.findUserOauthClientById(userId, clientId);
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
    const oauthClientEntity = await this.findUserOauthClientById(userId, clientId);
    if (!oauthClientEntity) {
      throw new OauthClientNotFound();
    }

    const newOauthClientEntity = merge(oauthClientEntity, {
      name: editOauthClientDto.name,
      description: editOauthClientDto.description,
      homepage_url: editOauthClientDto.homepageUrl,
      redirect_uris: editOauthClientDto.redirectUris?.join(';'),
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

  async findUserOauthClientById(userId: number, clientId: number): Promise<OauthClientEntity | null> {
    return await this.oauthClientRepository
      .createQueryBuilder('oauth_client')
      .innerJoin('oauth_client.user', 'user')
      .where('user.id = :userId and oauth_client.id = :clientId', {
        userId,
        clientId,
      })
      .getOne();
  }

  async findUserOauthClientByClientPublic(clientPublic: string): Promise<OauthClientEntity | null> {
    return await this.oauthClientRepository
      .createQueryBuilder('oauth_client')
      .where('oauth_client.client_public = :clientPublic', {
        clientPublic,
      })
      .addSelect(['oauth_client.client_secret'])
      .getOne();
  }

  async compareClientSecrets(clientSecret: string, hashedClientSecret: string): Promise<boolean> {
    return bcrypt.compare(clientSecret, hashedClientSecret);
  }

  private createOauthClient(oauthClient: Partial<OauthClientEntity>) {
    return this.oauthClientRepository.create(oauthClient);
  }

  private async saveOauthClient(oauthClient: OauthClientEntity): Promise<OauthClientEntity> {
    try {
      const clientEntity = await this.oauthClientRepository.save(oauthClient);
      return clientEntity;
    } catch (err) {
      throw this.formatError(err);
    }
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

  private async encryptClientSecret(clientSecret: string): Promise<string> {
    return bcrypt.hash(clientSecret, await bcrypt.genSalt());
  }

  private formatError(error: Error): AppError {
    if (error instanceof AppError) {
      return error;
    } else if (DbUtils.isUniqueViolationError(error)) {
      return new OauthClientAlreadyExist();
    } else if (DbUtils.isRelationConstraintError(error)) {
      return new OauthClientRelationsAreIncorrect();
    }

    return new InternalError();
  }
}
