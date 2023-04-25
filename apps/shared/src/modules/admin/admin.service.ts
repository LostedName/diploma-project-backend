import { AdminNotFound } from './../../../../backend/src/errors/app-errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';
import { AdminEntity } from '../database/entities/admin.entity';
import { AccountEntity } from '../database/entities/account.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  createAdmin(
    account: AccountEntity,
    adminData: Partial<AdminEntity>,
  ): Promise<AdminEntity> {
    const admin = this.adminRepository.create(adminData);
    admin.account = account;
    return this.adminRepository.save(admin);
  }

  async getAdminById(accountId: number): Promise<AdminEntity> {
    const adminEntity = await this.findAdminById(accountId);
    if (isNil(adminEntity)) {
      throw new AdminNotFound();
    }
    return adminEntity;
  }

  async findAdminById(accountId: number): Promise<AdminEntity | null> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.account', 'account')
      .where('account.id = :accountId', { accountId: accountId })
      .getOne();
  }

  async findAdminByEmail(email: string): Promise<AdminEntity | null> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.account', 'account')
      .where('account.email = :email', { email: email })
      .getOne();
  }
}
