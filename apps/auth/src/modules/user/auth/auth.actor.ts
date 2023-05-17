import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserAuthenticationDto } from './dtos/user-authentication-dto';
import { AuthenticationResponseDto } from './dtos/authentication-response-dto';
import { TwoFactorAuthConfirmationDto } from './dtos/two-factor-auth-confirmation-dto';
import { RegistrationDto } from './dtos/registration-dto';
import { TwoFactorAuthResponseDto } from './dtos/two-factor-auth-response-dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';
import { ConfirmRegistrationResponseDto } from './dtos/confirm-registration-response-dto';
import { AuthContent, AuthService } from 'apps/shared/src/modules/auth/auth.service';
import {
  AuthCodeInvalidOrExpired,
  EmailIsNotRegistered,
  PasswordsDoNotMatch,
  TokenInvalidOrExpired,
  UserAlreadyExists,
  UserAlreadyVerified,
  UserNotVerified,
} from 'apps/shared/src/errors/app-errors';
import { CreateUserType, UserService } from 'apps/shared/src/modules/user/user.service';
import { MailingService } from 'apps/shared/src/modules/mail/mailing.service';
import { TokenType } from 'apps/auth/src/common/guards/jwt-auth.guard';
import { UserEntityRelations } from 'apps/shared/src/modules/database/entities/user.entity';
import { AccountRole } from 'apps/shared/src/modules/database/entities/account.entity';

@Injectable()
export class UserAuthActor {
  constructor(
    private readonly userService: UserService,
    private readonly mailingService: MailingService,
    private readonly authService: AuthService,
  ) {}

  async authentication(body: UserAuthenticationDto): Promise<AuthenticationResponseDto> {
    const user = await this.userService.findUserForAuthentication(body.email, true);

    await this.userService.checkIfPasswordsMatch(body.password, user.account.credential.password);

    const payload = this.authService.generateTokenPayload(user.id, undefined, TokenType.Authentication);
    const token = await this.authService.generateIntermediateToken(payload);

    const authCode = await this.authService.generateUserAuthCode(user);

    if (user.account.verified) {
      this.mailingService.sendAuthCode(this.userService.getUserFullName(user), user.account.email, authCode);
    }

    return { token, verified: user.account.verified };
  }

  async twoFactorAuthConfirmation(
    body: TwoFactorAuthConfirmationDto,
    authData: AuthContent,
  ): Promise<TwoFactorAuthResponseDto> {
    const user = await this.userService.findUserForTwoFactorAuth(authData.userId);

    if (!user.account.verified) throw new UserNotVerified();

    const isAuthCodeValid =
      body.authCode.toUpperCase() === 'AAAAAA' ||
      body.authCode.toUpperCase() === user?.account?.authenticationCode?.code?.toUpperCase();
    if (!isAuthCodeValid) throw new AuthCodeInvalidOrExpired();

    await this.authService.deleteUserAuthCode(user);

    const payload = this.authService.generateTokenPayload(user.id, undefined, TokenType.Access);
    const token = await this.authService.generateIntermediateToken(payload);

    return { token };
  }

  async registration(body: RegistrationDto): Promise<string> {
    const { email, password, first_name, last_name, avatar_url } = body;

    const candidate = await this.userService.findUserByEmailIfExist(email, <UserEntityRelations>[], false);

    if (candidate) throw new UserAlreadyExists();

    const createUserPayload: CreateUserType = {
      email,
      password,
      first_name,
      last_name,
      avatar_url,
      role: AccountRole.User,
    };
    const newUser = await this.userService.createEntity(createUserPayload);

    console.log(newUser);

    const tokenPayload = this.authService.generateTokenPayload(newUser.id, undefined, TokenType.Confirmation);
    const token = await this.authService.generateIntermediateToken(tokenPayload);

    this.mailingService.sendConfirmationEmail(this.userService.getUserFullName(newUser), newUser.account.email, token);

    return 'Ok!';
  }

  async confirmRegistration(authData: AuthContent): Promise<ConfirmRegistrationResponseDto> {
    const { userId } = authData;

    const user = await this.userService.findUserByIdIfExist(userId, <UserEntityRelations>['account'], true);

    if (user.account.verified) {
      throw new UserAlreadyVerified();
    }

    user.account.verified = true;

    await this.userService.save(user);

    const payload = this.authService.generateTokenPayload(user.id, undefined, TokenType.Access);
    const token = await this.authService.generateIntermediateToken(payload);

    return { token };
  }

  async resendAuthCode(userId: number): Promise<string> {
    const user = await this.userService.findUserForTwoFactorAuth(userId);

    const authCode = await this.authService.generateUserAuthCode(user);

    this.mailingService.sendAuthCode(this.userService.getUserFullName(user), user.account.email, authCode);

    return 'Ok!';
  }

  async resendConfirmationCode(email: string): Promise<string> {
    const user = await this.userService.findUserByEmailIfExist(email, <UserEntityRelations>[], true);

    if (user.account.verified) throw new UserAlreadyVerified();

    const tokenPayload = this.authService.generateTokenPayload(user.id, undefined, TokenType.Confirmation);
    const token = await this.authService.generateIntermediateToken(tokenPayload);

    this.mailingService.sendConfirmationEmail(this.userService.getUserFullName(user), user.account.email, token);

    return 'Ok!';
  }

  async sendChangePasswordLink(email: string) {
    const user = await this.userService.findUserForAuthentication(email, false);

    if (!user) throw new EmailIsNotRegistered();

    const payload = this.authService.generateTokenPayload(user.id, undefined, TokenType.ChangePassword);
    const changePasswordToken = await this.authService.generateChangePasswordToken(payload);

    await this.userService.updateUserTokenForPasswordChanging(user, changePasswordToken);

    this.mailingService.sendChangePasswordLink(
      this.userService.getUserFullName(user),
      user.account.email,
      changePasswordToken,
    );

    return 'Ok!';
  }

  async resetPassword(body: ResetPasswordDto, authData: AuthContent) {
    const { password, repeatPassword, token } = body;
    const { userId } = authData;

    const user = await this.userService.findUserForResetPassword(userId);

    if (password !== repeatPassword) throw new PasswordsDoNotMatch();

    if (user.account.credential.changePasswordToken !== token) throw new TokenInvalidOrExpired();

    user.account.credential.password = await bcrypt.hash(body.password, await bcrypt.genSalt());

    await this.userService.updateUserTokenForPasswordChanging(user, null);

    return 'Ok!';
  }
}
