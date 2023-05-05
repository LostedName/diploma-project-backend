import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from './account.entity';
import { AppEntity } from './app.entity';

export enum AdminGender {
  Male,
  Female,
  Other,
}

@Entity({ name: 'admins', schema: 'public' })
export class AdminEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'Admin unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Admin account',
    required: true,
  })
  @OneToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: AccountEntity;

  @ApiProperty({
    description: 'Avatar url',
    required: true,
  })
  @Column({ nullable: true })
  avatar_url: string;

  @ApiProperty({
    description: 'Admin first name',
    required: true,
  })
  @Column({ nullable: true })
  first_name: string;

  @ApiProperty({
    description: 'Admin last name',
    required: true,
  })
  @Column({ nullable: true })
  last_name: string;
}
