import { merge } from 'lodash';
import {
  AppError,
  InternalError,
  OauthAppNotFound,
  OauthAppAlreadyExist,
} from './../../../../backend/src/errors/app-errors';
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
import { DbUtils } from '../../utils/database/db-utils';

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
      .where('user.id = :userId', { userId });

    if (params) {
      queryBuilder = params.filters().apply(queryBuilder);
    }

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
    const { items } = await this.getUserOauthAppsList(userId, null);
    let nameUnique = true;
    items.forEach((item) => {
      nameUnique = item.name !== createOauthAppDto.name && nameUnique;
    });
    if (!nameUnique) {
      throw new OauthAppAlreadyExist();
    }
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
      .where('user.id = :userId and oauth_apps.id = :appId', {
        userId,
        appId,
      })
      .leftJoinAndSelect('oauth_apps.oauth_clients', 'oauth_clients')
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

  private formatError(error: Error): AppError {
    if (error instanceof AppError) {
      return error;
    } else if (DbUtils.isUniqueViolationError(error)) {
      return new OauthAppAlreadyExist();
    }

    return new InternalError();
  }
}
