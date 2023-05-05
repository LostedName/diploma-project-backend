import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { isNil } from 'lodash';
import { UserEntity } from '../database/entities/user.entity';
import { AccountEntity } from '../database/entities/account.entity';
import { UserNotFound } from '../../errors/app-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    account: AccountEntity,
    userData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    user.account = account;
    return this.userRepository.save(user);
  }

  async updateUser(
    user: UserEntity,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
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
}
