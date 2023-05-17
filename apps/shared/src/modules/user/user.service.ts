import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { isNil } from 'lodash';
import { UserEntity, UserEntityRelations } from '../database/entities/user.entity';
import { AccountEntity, AccountRole } from '../database/entities/account.entity';
import { UserNotFound } from '../../errors/app-errors';
import { AuthenticationCodeEntity } from '../database/entities/authentication-code.entity';
import * as bcrypt from 'bcrypt';
import { CredentialEntity } from '../database/entities/credential.entity';

export type CreateUserType = {
  avatar_url: string | undefined;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: AccountRole;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AuthenticationCodeEntity)
    private authenticationCodeRepository: Repository<AuthenticationCodeEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async createUser(account: AccountEntity, userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    user.account = account;
    return this.userRepository.save(user);
  }

  async updateUser(user: UserEntity, updateData: Partial<UserEntity>): Promise<UserEntity> {
    user = this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.email = :email', { email: email })
      .getOne();

    if (isNil(user)) {
      throw new UserNotFound();
    }

    return user;
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.id = :id', { id: userId })
      .getOne();

    if (isNil(user)) {
      throw new UserNotFound();
    }

    return user;
  }

  async findUserByAccount(accountId: number): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.id = :accountId', { accountId: accountId })
      .getOne();

    if (isNil(user)) {
      throw new UserNotFound();
    }

    return user;
  }

  async hasUserForAccount(accountId: number): Promise<boolean> {
    return this.userQuery(accountId).getExists();
  }

  async saveAll(users: UserEntity[]): Promise<UserEntity[]> {
    return await this.userRepository.save(users);
  }

  private userQuery(accountId: number): SelectQueryBuilder<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.id = :accountId', { accountId: accountId });
  }

  async removeAuthCodes(authCodes: AuthenticationCodeEntity[]): Promise<AuthenticationCodeEntity[]> {
    return this.authenticationCodeRepository.remove(authCodes);
  }

  async checkIfPasswordsMatch(password: string, hash: string): Promise<void> {
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) throw new UserNotFound();

    return;
  }

  async updateUserTokenForPasswordChanging(user: UserEntity, changePasswordToken: string | null): Promise<UserEntity> {
    user.account.credential.changePasswordToken = changePasswordToken;

    return this.save(user);
  }

  async createEntity(payload: CreateUserType): Promise<UserEntity> {
    const { avatar_url, first_name, last_name, email, password, role } = payload;

    const creds = new CredentialEntity();
    creds.password = password !== null ? await bcrypt.hash(password, await bcrypt.genSalt()) : null;

    const account = new AccountEntity();
    account.email = email;
    account.role = role;
    account.credential = creds;

    const newUser = new UserEntity();
    newUser.avatar_url = avatar_url;
    newUser.first_name = first_name;
    newUser.last_name = last_name;
    newUser.account = account;

    return this.save(newUser);
  }

  async findUserByEmailIfExist(
    email: string,
    relations: UserEntityRelations,
    checkIfExists: boolean,
  ): Promise<UserEntity> {
    const candidate = await this.userRepository.findOne({
      relations: relations,
      where: { account: { email } },
    });

    if (checkIfExists && !candidate) throw new UserNotFound();

    return candidate;
  }

  async findUserForAuthentication(email: string, checkIfExists: boolean): Promise<UserEntity> {
    const candidate = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.account', 'a')
      .leftJoinAndSelect('a.credential', 'creds')
      .where('a.email = :email', { email })
      .getOne();

    if (!candidate && checkIfExists) throw new UserNotFound();

    return candidate;
  }

  async findUserByIdIfExist(
    userId: number,
    relations: UserEntityRelations,
    checkIfExists: boolean,
  ): Promise<UserEntity> {
    const candidate = await this.userRepository.findOne({
      relations: relations,
      where: { id: userId },
    });

    if (checkIfExists && !candidate) throw new UserNotFound();

    return candidate;
  }

  async findUserForTwoFactorAuth(userId: number): Promise<UserEntity> {
    const candidate = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.account', 'a')
      .leftJoinAndSelect('a.authenticationCode', 'ac')
      .where('u.id = :userId', { userId })
      .getOne();

    if (!candidate) throw new UserNotFound();

    return candidate;
  }

  async findUserForResetPassword(userId: number): Promise<UserEntity> {
    const candidate = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.account', 'a')
      .leftJoinAndSelect('a.credential', 'creds')
      .where('a.id = :userId', { userId })
      .getOne();

    if (!candidate) throw new UserNotFound();

    return candidate;
  }

  getUserFullName(user: UserEntity): string {
    return `${user.first_name} ${user.last_name}`;
  }
}
