import {
  AuthenticatedIdentity,
  Authenticator,
} from '../authentication.service';
import { AccountPasswordsService } from '../account-passwords.service';
import {
  AccountEntity,
  AuthenticationMethod,
} from '../../database/entities/account.entity';

export class PasswordAuthenticator implements Authenticator {
  readonly authenticationMethod: AuthenticationMethod =
    AuthenticationMethod.Password;

  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly passwordsService: AccountPasswordsService,
  ) {}

  async authenticate(): Promise<AuthenticatedIdentity> {
    await this.passwordsService.hasBoundPassword(this.email, this.password);

    return { email: this.email };
  }

  async bind(account: AccountEntity): Promise<void> {
    await this.passwordsService.bindPassword(account, this.password);
    return;
  }
}
