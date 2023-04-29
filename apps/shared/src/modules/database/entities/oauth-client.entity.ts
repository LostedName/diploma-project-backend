import {
  Column,
  Entity,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { OauthApplicationEntity } from './oauth-application.entity';

@Entity({ name: 'oauth_client', schema: 'public' })
export class OauthClientEntity extends AppEntity {
  @ApiProperty({
    example: 'Oauth client identifier',
    description: 'Oauth client identifier',
    type: String,
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Oauth foreign application client public id',
    description: 'Oauth foreign application client public id',
    type: String,
    required: true,
  })
  @Column({ unique: true })
  client_public: string;

  @ApiProperty({
    example: 'Client secret',
    description: 'Hashed application client secret',
    type: String,
    required: true,
  })
  @Column({ select: false })
  client_secret: string;

  @ApiProperty({
    example: 'Application client name',
    description: 'Application client name',
    type: String,
    required: true,
  })
  @Column()
  name: string; // required

  @ApiProperty({
    example: 'Application client description',
    description: 'Application client description',
    type: String,
  })
  @Column({ default: '' })
  description: string;

  @ApiProperty({
    example: '',
    description: '',
    type: String,
    required: true,
  })
  @Column({ nullable: true })
  icon_url: string;

  @ApiProperty({
    example: 'Homepage url',
    description: 'Homepage url',
    type: String,
    required: true,
  })
  @Column()
  homepage_url: string;

  @ApiProperty({
    example: 'Redirect urls',
    description: 'Semicolon separated redirect urls',
    type: String,
    required: true,
  })
  @Column()
  redirect_urls: string;

  @ApiProperty({
    example: null,
    description: 'Oauth client deletion date',
    required: true,
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => OauthApplicationEntity, (app) => app.oauth_clients, {
    onDelete: 'CASCADE',
  })
  oauth_application: OauthApplicationEntity;
}
