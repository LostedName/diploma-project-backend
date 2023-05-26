import { plainToInstance } from 'class-transformer';
import { DbUtils } from './../../../utils/database/db-utils';
import {
  AppError,
  AuthorizationCodeNotFound,
  InternalError,
  OAuthInvalidScope,
  OauthClientAlreadyExist,
  OauthClientNotFound,
  OauthClientRelationsAreIncorrect,
  RedirectUriMismatch,
} from './../../../errors/app-errors';
import { Injectable, LoggerService } from '@nestjs/common';
import * as crypto from 'crypto';
import { AppLogger } from '../../logging/logger.service';
import { AuthorizationCode } from './auth-code';
import { RedisService } from '../../redis/redis.service';
import { OauthClientService } from '../oauth-client/oauth-client.service';
import { checkScopesExistance } from '../scopes/scopes';
import * as uuid from 'uuid';

@Injectable()
export class OauthService {
  readonly logger: LoggerService;

  constructor(
    private readonly redisService: RedisService,
    private readonly oauthClientService: OauthClientService,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('Oauth Service');
  }

  async createAuthorizationCode(
    client_id: string,
    user_email: string,
    redirect_uri: string,
    scopes_string: string,
  ): Promise<AuthorizationCode> {
    const oauthClient = await this.oauthClientService.findUserOauthClientByClientPublic(client_id);

    if (!oauthClient) {
      throw new OauthClientNotFound();
    }
    //check redirect uri
    const redirectUris = oauthClient.redirect_uris.split(';');
    const redirectUriExist = redirectUris.some((url) => redirect_uri === url);

    if (!redirectUriExist) {
      throw new RedirectUriMismatch();
    }

    //check scopes existance
    const scopes = scopes_string.split(' ');
    const allScopesExists = checkScopesExistance(scopes);
    if (!allScopesExists) {
      throw new OAuthInvalidScope();
    }

    const codeId = uuid.v4();
    const code = this.generateAuthCode();
    const authorizationCode = new AuthorizationCode(codeId, code, client_id, user_email, redirect_uri, scopes_string);
    console.log('AUTHORIZATION TO SAVE', authorizationCode);
    await this.saveAuthCodeToRedis(authorizationCode);
    return authorizationCode;
  }

  async matchAuthorizationCode(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    code: string,
  ): Promise<AuthorizationCode> {
    const authorizationCode = await this.getAuthCodeFromRedis(code);
    console.log('Authorization code from redis: ', authorizationCode);
    console.log('Authorization code from redis: ', authorizationCode.clientId);
    const oauthClient = await this.oauthClientService.findUserOauthClientByClientPublic(client_id);
    console.log('OAuth client: ', oauthClient);
    console.log('OAuth clients auth: ', authorizationCode.clientId, client_id);
    if (!oauthClient || authorizationCode.clientId !== client_id) {
      throw new OauthClientNotFound();
    }

    const clientSecretMatchs = await this.oauthClientService.compareClientSecrets(
      client_secret,
      oauthClient.client_secret,
    );

    console.log('Client secret match: ', clientSecretMatchs);

    if (!clientSecretMatchs) {
      throw new OauthClientNotFound();
    }

    if (authorizationCode.redirectUri !== redirect_uri) {
      throw new RedirectUriMismatch();
    }

    return authorizationCode;
  }

  private async getAuthCodeFromRedis(code: string): Promise<AuthorizationCode> {
    const authCodePlain = await this.redisService.get(code);
    if (!authCodePlain) {
      throw new AuthorizationCodeNotFound();
    }
    const authCode = plainToInstance(AuthorizationCode, JSON.parse(authCodePlain));
    console.log('KEYS', Object.keys(authCode));
    return authCode;
  }

  private async saveAuthCodeToRedis(authCode: AuthorizationCode): Promise<'OK'> {
    return await this.redisService.set(authCode.code, JSON.stringify(authCode), 600);
  }

  private generateAuthCode() {
    return `${this.generateRandomHexString(16)}`;
  }

  private generateRandomHexString(size: number) {
    return crypto.randomBytes(size).toString('hex');
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
