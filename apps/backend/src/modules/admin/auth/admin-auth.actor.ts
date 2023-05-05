import { CredentialsAreIncorrect } from './../../../../../shared/src/errors/app-errors';
import {
  AccountRole,
  AccountStatus,
} from './../../../../../shared/src/modules/database/entities/account.entity';
import { Injectable, Scope } from '@nestjs/common';
import { AdminLoginDto, AdminLoginResultDto } from './dto/admin-login.dto';
import { AuthenticationService } from '../../../../../shared/src/modules/authentication/authentication.service';
import { isNil } from 'lodash';
import { AuthorisationService } from '../../../../../shared/src/modules/authorisation/authorisation.service';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminService } from '../../../../../shared/src/modules/admin/admin.service';
import { RequestActor } from '../../../../../shared/src/actor/request.actor';
import { AccountPasswordsService } from '../../../../../shared/src/modules/authentication/account-passwords.service';
import { PasswordAuthenticator } from '../../../../../shared/src/modules/authentication/authenticators/password-authenticator';

@Injectable({ scope: Scope.REQUEST })
export class AdminAuthActor extends RequestActor {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly authorisationService: AuthorisationService,
    private readonly passwordsService: AccountPasswordsService,
    private readonly adminService: AdminService,
  ) {
    super();
  }

  async login(loginDto: AdminLoginDto): Promise<AdminLoginResultDto> {
    const account = await this.authenticationService.authenticate(
      new PasswordAuthenticator(
        loginDto.email,
        loginDto.password,
        this.passwordsService,
      ),
    );

    const admin = await this.adminService.findAdminById(account.id);
    if (isNil(admin)) {
      throw new CredentialsAreIncorrect();
    }

    const adminAuthorisation =
      await this.authorisationService.authoriseAdminAccess(account);
    const token = await this.authorisationService.encodeAuthorisation(
      adminAuthorisation,
    );

    return { admin: admin, token: token };
  }

  async register(registerDto: AdminRegisterDto): Promise<AdminLoginResultDto> {
    const authenticator = new PasswordAuthenticator(
      registerDto.email,
      registerDto.password,
      this.passwordsService,
    );

    const account = await this.authenticationService.createAdmin(
      {
        email: registerDto.email,
        role: AccountRole.Admin,
        status: AccountStatus.Enabled,
      },
      authenticator,
    );

    const admin = await this.adminService.createAdmin(account, {});

    const adminAuthorisation =
      await this.authorisationService.authoriseAdminAccess(account);
    const token = await this.authorisationService.encodeAuthorisation(
      adminAuthorisation,
    );

    return { admin: admin, token: token };
  }
}
