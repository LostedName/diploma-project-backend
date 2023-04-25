import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';
import {
  AccountAlreadyExists,
  AccountNotFound,
  CredentialsAreIncorrect,
  InternalError,
} from '../../../../backend/src/errors/app-errors';
import { DbUtils } from '../../utils/database/db-utils';
import { PasswordAuthenticator } from './authenticators/password-authenticator';
import {
  AccountEntity,
  AccountRole,
  AccountStatus,
  AuthenticationMethod,
} from '../database/entities/account.entity';

export type AuthenticatedIdentity = { email: string };

export interface Authenticator {
  authenticationMethod: AuthenticationMethod;

  authenticate(): Promise<AuthenticatedIdentity>;
  bind(account: AccountEntity): Promise<void>;
}

@Injectable()
export class AuthenticationService {
  private readonly logger: LoggerService;

  constructor(
    logger: AppLogger,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    this.logger = logger.withContext('AuthenticationService');
  }

  async findAccountByEmail(email: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({
      where: { email: email },
    });

    if (isNil(account)) {
      throw new AccountNotFound();
    }

    return account;
  }

  async authenticate(authenticator: Authenticator): Promise<AccountEntity> {
    const identity = await authenticator.authenticate();
    const account = await this.findAccountByEmail(identity.email);
    if (account.authentication_method !== authenticator.authenticationMethod) {
      throw new CredentialsAreIncorrect();
    }

    return account;
  }

  async createUserAccount(
    email: string,
    authenticator: Authenticator,
  ): Promise<AccountEntity> {
    let account = this.accountRepository.create();
    account.email = email;
    account.role = AccountRole.User;
    account.verified = true;
    account.authentication_method = authenticator.authenticationMethod;
    try {
      account = await this.accountRepository.save(account);
      await authenticator.bind(account);
    } catch (err) {
      if (DbUtils.isUniqueViolationError(err)) {
        throw new AccountAlreadyExists();
      } else {
        throw new InternalError();
      }
    }

    return account;
  }

  async createAdmin(
    admin: {
      email: string;
      role: AccountRole.Admin;
      status: AccountStatus;
    },
    authenticator: PasswordAuthenticator,
  ): Promise<AccountEntity> {
    let account = this.accountRepository.create(admin);
    account.verified = true;
    account.authentication_method = authenticator.authenticationMethod;

    try {
      account = await this.accountRepository.save(account);
      await authenticator.bind(account);
    } catch (err) {
      if (DbUtils.isUniqueViolationError(err)) {
        throw new AccountAlreadyExists();
      } else {
        throw new InternalError();
      }
    }

    return account;
  }

  async updateAdminAccount(
    account: AccountEntity,
    updateAccountDto: Partial<AccountEntity>,
  ): Promise<AccountEntity> {
    account = await this.accountRepository.merge(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  async deleteAccount(id: number) {
    return this.accountRepository.delete({ id });
  }

  async markEmailVerified(account: AccountEntity): Promise<AccountEntity> {
    account.verified = true;
    return this.accountRepository.save(account);
  }
}
