import { merge } from 'lodash';
import { OauthAppNotFound } from './../../../../backend/src/errors/app-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { UserEntity } from '../database/entities/user.entity';
import { OauthApplicationEntity } from '../database/entities/oauth-application.entity';
import {
  OauthAppsListDto,
  OauthAppsListResponseDto,
} from 'apps/backend/src/modules/user/oauth-application/dto/oauth-apps-list.dto';
import { CreateOauthAppDto } from 'apps/backend/src/modules/user/oauth-application/dto/create-oauth-app.dto';
import { EditOauthAppDto } from 'apps/backend/src/modules/user/oauth-application/dto/edit-oauth-app.dto';

@Injectable()
export class OauthAppService {
  readonly logger: LoggerService;

  constructor(
    @InjectRepository(OauthApplicationEntity)
    private readonly oauthAppRepository: Repository<OauthApplicationEntity>,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('OauthAppService');
  }

  async getUserOauthAppsList(
    userId: number,
    params: OauthAppsListDto,
  ): Promise<OauthAppsListResponseDto> {
    let queryBuilder = this.oauthAppRepository
      .createQueryBuilder('oauth_apps')
      .innerJoin('oauth_apps.user', 'user')
      .innerJoinAndSelect('oauth_apps.oauth_clients', 'oauth_clients')
      .where('user.id = :userId and oauth_apps.deleted_at is null', { userId })
      .select(['oauth_apps.id', 'oauth_apps.name', 'oauth_apps.created_at']);

    queryBuilder = params.filters().apply(queryBuilder);

    const [items, total] = await queryBuilder.getManyAndCount();
    return {
      items: items,
      total: total,
    };
  }
  async getUserOauthAppById(
    userId: number,
    appId: number,
  ): Promise<OauthApplicationEntity> {
    const oauthApp = await this.findUserOauthAppById(userId, appId);
    if (!oauthApp) {
      throw new OauthAppNotFound();
    }
    return oauthApp;
  }

  async createUserOauthApp(
    userId: number,
    createOauthAppDto: CreateOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    const oauthAppEntity = this.createOauthApp(createOauthAppDto);
    oauthAppEntity.user = <UserEntity>{ id: userId };
    const oauthApp = await this.saveOauthApp(oauthAppEntity);
    return await this.findUserOauthAppById(userId, oauthApp.id);
  }

  async editUserOauthApp(
    userId: number,
    appId: number,
    editOauthAppDto: EditOauthAppDto,
  ): Promise<OauthApplicationEntity> {
    const oauthAppEntity = await this.findUserOauthAppById(userId, appId);
    if (!oauthAppEntity) {
      throw new OauthAppNotFound();
    }
    const newOauthAppEntity = merge(oauthAppEntity, editOauthAppDto);
    const newOauthApp = await this.saveOauthApp(newOauthAppEntity);
    return await this.findUserOauthAppById(userId, newOauthApp.id);
  }

  async deleteUserOauthApp(
    userId: number,
    appId: number,
  ): Promise<OauthApplicationEntity> {
    const oauthAppEntity = await this.findUserOauthAppById(userId, appId);
    if (!oauthAppEntity) {
      throw new OauthAppNotFound();
    }
    await this.deleteOauthApp(oauthAppEntity.id);
    return oauthAppEntity;
  }

  async findUserOauthAppById(
    userId: number,
    appId: number,
  ): Promise<OauthApplicationEntity | null> {
    return await this.oauthAppRepository
      .createQueryBuilder('oauth_apps')
      .innerJoin('oauth_apps.user', 'user')
      .where(
        'user.id = :userId and oauth_apps.id = :appId and oauth_apps.deleted_at is null',
        {
          userId,
          appId,
        },
      )
      .innerJoinAndSelect('oauth_apps.oauth_clients', 'oauth_clients')
      .select([
        'oauth_apps.id',
        'oauth_apps.name',
        'oauth_apps.created_at',
        'oauth_clients.client_public',
        'oauth_clients.name',
        'oauth_clients.description',
        'oauth_clients.icon_url',
        'oauth_clients.homepage_url',
        'oauth_clients.redirect_urls',
      ])
      .getOne();
  }

  private createOauthApp(oauthApp: Partial<OauthApplicationEntity>) {
    return this.oauthAppRepository.create(oauthApp);
  }

  private saveOauthApp(oauthApp: OauthApplicationEntity) {
    return this.oauthAppRepository.save(oauthApp);
  }

  private async deleteOauthApp(appId: number) {
    return await this.oauthAppRepository.softDelete(appId);
  }
}
