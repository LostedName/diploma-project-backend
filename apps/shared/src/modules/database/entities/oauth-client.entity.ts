import { Column, Entity, DeleteDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { UserEntity } from './user.entity';

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
  @Column({ unique: true })
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
    example: 'Redirect uris',
    description: 'Semicolon separated redirect uris',
    type: String,
    required: true,
  })
  @Column()
  redirect_uris: string;

  @ApiProperty({
    example: null,
    description: 'Oauth client deletion date',
    required: true,
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.oauth_clients, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
