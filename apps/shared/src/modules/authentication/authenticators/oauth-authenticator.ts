import { AuthenticatedIdentity, Authenticator } from '../authentication.service';
import { AuthenticationMethod } from '../../database/entities/account.entity';

export class OAuthAuthenticator implements Authenticator {
  readonly authenticationMethod: AuthenticationMethod = AuthenticationMethod.Password;

  constructor(private readonly email: string) {}

  async authenticate(): Promise<AuthenticatedIdentity> {
    return { email: this.email };
  }

  async bind(): Promise<void> {
    return;
  }
}
