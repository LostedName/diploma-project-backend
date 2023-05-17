import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from './account.entity';
import { AppEntity } from './app.entity';

@Entity({ name: 'passwords', schema: 'public' })
export class PasswordsEntity extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    description: 'User account',
    required: true,
  })
  @OneToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: AccountEntity;
}
