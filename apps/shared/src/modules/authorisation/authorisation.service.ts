import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { JwtService } from '@nestjs/jwt';
import {
  AppAuthorisation,
  AuthorisationClaims,
  MainClaims,
  OAuthClaims,
} from './authorisations/app-authorisation';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { isNil } from 'lodash';
import { SystemSettingsService } from '../system-settings/system-settings.service';
import { add, isPast } from 'date-fns';
import {
  AccountEntity,
  AccountRole,
} from '../database/entities/account.entity';
import { BadToken } from '../../errors/app-errors';

@Injectable()
export class AuthorisationService {
  private readonly logger: LoggerService;

  constructor(
    logger: AppLogger,
    private readonly jwtService: JwtService,
    private readonly systemSettingsService: SystemSettingsService,
  ) {
    this.logger = logger.withContext('AuthorisationService');
  }

  async authoriseAdminAccess(
    account: AccountEntity,
  ): Promise<AppAuthorisation> {
    const { admin_session_duration_seconds } =
      await this.systemSettingsService.getCachedSystemSettings();

    const expireDate = add(new Date(), {
      seconds: admin_session_duration_seconds,
    });

    const adminAccessAuth = AppAuthorisation.createRoleAccessAuthorisation(
      this.createMainClaims(account, expireDate),
      AuthorisationClaims.createRoleClaim(AccountRole.Admin),
    );

    return adminAccessAuth;
  }

  async authoriseUserAccess(account: AccountEntity): Promise<AppAuthorisation> {
    const { user_session_duration_seconds } =
      await this.systemSettingsService.getCachedSystemSettings();

    const expireDate = add(new Date(), {
      seconds: user_session_duration_seconds,
    });

    const userAccess = AppAuthorisation.createRoleAccessAuthorisation(
      this.createMainClaims(account, expireDate),
      AuthorisationClaims.createRoleClaim(AccountRole.User),
    );

    return userAccess;
  }

  async authoriseUserOAuthAccess(
    account: AccountEntity,
    clientId: string,
    scopes: string[],
  ): Promise<AppAuthorisation> {
    const { oauth_session_duration_seconds } =
      await this.systemSettingsService.getCachedSystemSettings();

    const expireDate = add(new Date(), {
      seconds: oauth_session_duration_seconds,
    });

    const userOAuthAccess = AppAuthorisation.createOAuthAccessAuthorization(
      this.createMainClaims(account, expireDate),
      AuthorisationClaims.createRoleClaim(AccountRole.User),
      this.createOAuthClaims(clientId, scopes),
    );

    return userOAuthAccess;
  }

  async encodeAuthorisation(authorisation: AppAuthorisation) {
    const payload = instanceToPlain(authorisation);

    return await this.jwtService.signAsync(payload);
  }

  async decodeAuthorisation(token: string): Promise<AppAuthorisation> {
    try {
      const authorisationData: any = await this.jwtService.decode(token);
      const appAuthorisation = plainToInstance(
        AppAuthorisation,
        <object>authorisationData,
      );
      this.jwtService.verify(token);
      const mainClaim = await appAuthorisation.getClaim(MainClaims);

      await this.validateMainClaim(mainClaim);

      return appAuthorisation;
    } catch (e) {
      throw new BadToken();
    }
  }

  private createMainClaims(
    account: AccountEntity | undefined = undefined,
    expireDate: Date | undefined = add(new Date(), { hours: 1 }),
  ): MainClaims {
    return AuthorisationClaims.createMainClaim(
      new Date(),
      expireDate,
      account?.email || null,
    );
  }

  private createOAuthClaims(clientId: string, scopes: string[]): OAuthClaims {
    return AuthorisationClaims.createOAuthClaim(clientId, scopes);
  }

  private async validateMainClaim(mainClaim: MainClaims) {
    if (isNil(mainClaim) || isPast(mainClaim.exp)) {
      throw new BadToken();
    }
  }
}
