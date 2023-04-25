import { AccountRole } from './../../../../shared/src/modules/database/entities/account.entity';
import { UserEntity } from './../../../../shared/src/modules/database/entities/user.entity';
import { AdminEntity } from './../../../../shared/src/modules/database/entities/admin.entity';
import { AppAuthorisation } from '../../../../shared/src/modules/authorisation/authorisations/app-authorisation';
import { Request } from 'express';

export type RequestWithIdentity = Request & {
  requestIdentity: RequestIdentity;
};

export type IdentityWithRole = {
  request: RequestWithIdentity;
  role: AccountRole;
};

export class RequestIdentity {
  constructor(
    readonly identifier: string | null,
    readonly account: AdminEntity | UserEntity | null,
    readonly authorisation: AppAuthorisation | null,
  ) {}

  get isAnonymous(): boolean {
    return this.identifier === null;
  }

  static createAnonymous(): RequestIdentity {
    return new RequestIdentity(null, null, null);
  }

  get user(): UserEntity | null {
    if (this.account instanceof UserEntity) {
      return this.account;
    }

    return null;
  }

  get admin(): AdminEntity | null {
    if (this.account instanceof AdminEntity) {
      return this.account;
    }

    return null;
  }
}
