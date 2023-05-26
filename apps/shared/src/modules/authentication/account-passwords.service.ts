import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';
import { PasswordAuthenticator } from './authenticators/password-authenticator';
import { PasswordsEntity } from '../database/entities/passwords.entity';
import { AccountEntity } from '../database/entities/account.entity';
import { CredentialsAreIncorrect } from '../../errors/app-errors';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class AccountPasswordsService {
  constructor(
    @InjectRepository(PasswordsEntity)
    private readonly passwordsRepository: Repository<PasswordsEntity>,
    private readonly cryptoService: CryptoService,
  ) {}

  async hasBoundPassword(email: string, password: string): Promise<boolean> {
    const accountPassword = await this.findAccountPasswords(email);
    if (isNil(accountPassword)) {
      throw new CredentialsAreIncorrect();
    }

    if (!(await this.matchPasswords(password, accountPassword.password))) {
      throw new CredentialsAreIncorrect();
    }

    return true;
  }

  async bindPassword(account: AccountEntity, password: string): Promise<PasswordsEntity> {
    const accountPassword = this.passwordsRepository.create();
    accountPassword.password = await this.hashPassword(password);
    accountPassword.account = account;
    return this.passwordsRepository.save(accountPassword);
  }

  async changePassword(account: AccountEntity, newPassword: string): Promise<PasswordsEntity> {
    const accountPassword = await this.findAccountPasswords(account.email);
    const hashedPassword = await this.hashPassword(newPassword);
    accountPassword.password = hashedPassword;
    return this.passwordsRepository.save(accountPassword);
  }

  createAuthenticator(email: string, password: string): PasswordAuthenticator {
    return new PasswordAuthenticator(email, password, this);
  }

  private async findAccountPasswords(email: string): Promise<PasswordsEntity | null> {
    return this.passwordsRepository
      .createQueryBuilder('passwords')
      .leftJoinAndSelect('passwords.account', 'account')
      .where('account.email = :email', { email: email })
      .getOne();
  }

  async matchPasswords(password: string, accountPassword: string): Promise<boolean> {
    return await this.cryptoService.compare(password, accountPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await this.cryptoService.hash(password);
  }
}
