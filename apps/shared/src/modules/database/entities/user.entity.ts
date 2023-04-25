import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from './account.entity';
import { AppEntity } from './app.entity';
import { NoteEntity } from './note.entity';
import { ApplicationEntity } from './application.entity';

export enum UserGender {
  Male,
  Female,
  Other,
}

@Entity({ name: 'users', schema: 'public' })
export class UserEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'User unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User account',
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
    description: 'User first name',
    required: true,
  })
  @Column()
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    required: true,
  })
  @Column()
  last_name: string;

  @ApiProperty({
    description: 'User phone number',
    required: true,
  })
  @Column()
  phone_number: string;

  @ApiProperty({
    example: '1',
    description: 'User gender',
    required: true,
  })
  @Column()
  gender: UserGender;

  @ApiProperty({
    description: 'User birth date',
    required: true,
  })
  @Column()
  birth_date: Date;

  @OneToMany(() => NoteEntity, (note) => note.user, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  notes: NoteEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  applications: ApplicationEntity[];
}
