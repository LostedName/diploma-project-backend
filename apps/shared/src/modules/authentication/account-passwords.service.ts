import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { isNil } from 'lodash';
import { CredentialsAreIncorrect } from '../../../../backend/src/errors/app-errors';
import { PasswordAuthenticator } from './authenticators/password-authenticator';
import { PasswordsEntity } from '../database/entities/passwords.entity';
import { AccountEntity } from '../database/entities/account.entity';

@Injectable()
export class AccountPasswordsService {
  constructor(
    @InjectRepository(PasswordsEntity)
    private readonly passwordsRepository: Repository<PasswordsEntity>,
  ) {}

  async hasBoundPassword(email: string, password: string): Promise<boolean> {
    const accountPassword = await this.findAccountPasswords(email);
    if (isNil(accountPassword)) {
      throw new CredentialsAreIncorrect();
    }

    if (!(await this.matchPasswords(password, accountPassword))) {
      throw new CredentialsAreIncorrect();
    }

    return true;
  }

  async bindPassword(
    account: AccountEntity,
    password: string,
  ): Promise<PasswordsEntity> {
    const accountPassword = this.passwordsRepository.create();
    accountPassword.password = await this.encryptPassword(password);
    accountPassword.account = account;
    return this.passwordsRepository.save(accountPassword);
  }

  async changePassword(
    account: AccountEntity,
    newPassword: string,
  ): Promise<PasswordsEntity> {
    const accountPassword = await this.findAccountPasswords(account.email);
    const hashedPassword = await this.encryptPassword(newPassword);
    accountPassword.password = hashedPassword;
    return this.passwordsRepository.save(accountPassword);
  }

  createAuthenticator(email: string, password: string): PasswordAuthenticator {
    return new PasswordAuthenticator(email, password, this);
  }

  private async findAccountPasswords(
    email: string,
  ): Promise<PasswordsEntity | null> {
    return this.passwordsRepository
      .createQueryBuilder('passwords')
      .leftJoinAndSelect('passwords.account', 'account')
      .where('account.email = :email', { email: email })
      .getOne();
  }

  private async matchPasswords(
    password: string,
    accountPasswords: PasswordsEntity,
  ): Promise<boolean> {
    return bcrypt.compare(password, accountPasswords.password);
  }

  private async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt());
  }
}
