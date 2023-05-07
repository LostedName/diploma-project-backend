import { RequestActor } from './../../../../../shared/src/actor/request.actor';
import {
  CredentialsAreIncorrect,
  UserNotFound,
} from './../../../../../shared/src/errors/app-errors';
import { UserEntity } from './../../../../../shared/src/modules/database/entities/user.entity';
import {
  AuthenticationService,
  Authenticator,
} from './../../../../../shared/src/modules/authentication/authentication.service';
import { AuthorisationService } from './../../../../../shared/src/modules/authorisation/authorisation.service';
import { AccountPasswordsService } from './../../../../../shared/src/modules/authentication/account-passwords.service';
import { UserService } from './../../../../../shared/src/modules/user/user.service';
import { PasswordAuthenticator } from './../../../../../shared/src/modules/authentication/authenticators/password-authenticator';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { OAuthLoginDto, OAuthLoginResultDto } from './dto/oauth-dto';

@Injectable({ scope: Scope.REQUEST })
export class OAuthActor extends RequestActor {
  private readonly logger: LoggerService;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly authorisationService: AuthorisationService,
    private readonly userService: UserService,
    private readonly passwordsService: AccountPasswordsService,
    logger: AppLogger,
  ) {
    super();
    this.logger = logger.withContext('UserAuthActor');
  }

  async loginOAuth(oauthloginDto: OAuthLoginDto): Promise<OAuthLoginResultDto> {
    const authenticator = new PasswordAuthenticator(
      oauthloginDto.email,
      oauthloginDto.password,
      this.passwordsService,
    );

    return this.authorizeOAuth(
      authenticator,
      'client Id',
      oauthloginDto.scopes,
    );
  }

  private async authorizeOAuth(
    authenticator: Authenticator,
    clientId: string,
    scopes: string[],
  ) {
    const account = await this.authenticationService.authenticate(
      authenticator,
    );
    let user: UserEntity;
    try {
      user = await this.userService.findUserByAccount(account.id);
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new CredentialsAreIncorrect();
      }

      throw err;
    }

    const authorisation =
      await this.authorisationService.authoriseUserOAuthAccess(
        account,
        clientId,
        scopes,
      );
    return {
      user,
      token: await this.authorisationService.encodeAuthorisation(authorisation),
    };
  }
}
