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
import { OauthClientEntity } from './oauth-client.entity';

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

  @OneToMany(() => NoteEntity, (note) => note.user, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  notes: NoteEntity[];

  @OneToMany(() => OauthClientEntity, (client) => client.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  oauth_clients: OauthClientEntity[];
}
