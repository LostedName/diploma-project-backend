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
import {
  UserAccountRegistrationDto,
  UserLoginDto,
  UserLoginResultDto,
} from './dto/user-auth-dto';

@Injectable({ scope: Scope.REQUEST })
export class UserAuthActor extends RequestActor {
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

  async register(
    registerData: UserAccountRegistrationDto,
  ): Promise<UserLoginResultDto> {
    const authenticator = new PasswordAuthenticator(
      registerData.email,
      registerData.password,
      this.passwordsService,
    );

    const account = await this.authenticationService.createUserAccount(
      registerData.email,
      authenticator,
    );

    await this.userService.createUser(account, {
      first_name: registerData.firstName,
      last_name: registerData.lastName,
    });

    let user: UserEntity;
    try {
      user = await this.userService.findUserByAccount(account.id);
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new CredentialsAreIncorrect();
      }

      throw err;
    }

    const authorisation = await this.authorisationService.authoriseUserAccess(
      account,
    );
    const token = await this.authorisationService.encodeAuthorisation(
      authorisation,
    );

    return {
      token: token,
      user: user,
    };
  }

  async login(loginDto: UserLoginDto): Promise<UserLoginResultDto> {
    const authenticator = new PasswordAuthenticator(
      loginDto.email,
      loginDto.password,
      this.passwordsService,
    );

    return this.loginUsingMethod(authenticator);
  }

  private async loginUsingMethod(
    authenticator: Authenticator,
  ): Promise<UserLoginResultDto> {
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

    const authorisation = await this.authorisationService.authoriseUserAccess(
      account,
    );
    return {
      user,
      token: await this.authorisationService.encodeAuthorisation(authorisation),
    };
  }
}
