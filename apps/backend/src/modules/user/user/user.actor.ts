import { RedisService } from './../../../../../shared/src/modules/redis/redis.service';
import {
  ForbiddenAction,
  UserNotFound,
} from './../../../../../shared/src/errors/app-errors';
import { UserEntity } from './../../../../../shared/src/modules/database/entities/user.entity';
import { AccountPasswordsService } from './../../../../../shared/src/modules/authentication/account-passwords.service';
import { RequestActor } from '../../../../../shared/src/actor/request.actor';
import { AppLogger } from './../../../../../shared/src/modules/logging/logger.service';
import { UserService } from './../../../../../shared/src/modules/user/user.service';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { isNil } from 'lodash';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserActor extends RequestActor {
  private logger: LoggerService;

  constructor(
    private readonly userService: UserService,
    private readonly passwordsService: AccountPasswordsService,
    private readonly redisService: RedisService,
    logger: AppLogger,
  ) {
    super();

    this.logger = logger.withContext('UserActor');
  }
  async getKey(key: string) {
    console.log('KEY: ', key);
    return await this.redisService.get(key);
  }

  async setKey(key: string, value: string) {
    console.log('KEY: ', key);
    console.log('VALUE: ', value);
    return await this.redisService.set(key, value, 10);
  }

  async getUserProfile(): Promise<UserEntity> {
    const user = this.getUserIdentity();
    return await this.userService.findUserById(user.account.id);
  }

  async updateUserProfile(
    updateUserDto: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    const user = this.getUserIdentity();
    return await this.userService.updateUser(user, {
      first_name: updateUserDto.firstName,
      last_name: updateUserDto.lastName,
      avatar_url: updateUserDto.avatarUrl,
    });
  }

  async updateUserPassword(
    updatePasswordDto: UpdateUserPasswordDto,
  ): Promise<UserEntity> {
    const user = this.getUserIdentity();

    const oldPassword = updatePasswordDto.oldPassword;
    const newPassword = updatePasswordDto.newPassword;

    await this.passwordsService.hasBoundPassword(
      user.account.email,
      oldPassword,
    );
    await this.passwordsService.changePassword(user.account, newPassword);

    return user;
  }

  private getUserIdentity(): UserEntity {
    const user = this.requestIdentity.user;

    if (isNil(user)) {
      throw new UserNotFound();
    }

    const { account } = user;

    if (!account) {
      throw new ForbiddenAction();
    }

    return user as UserEntity;
  }
}
