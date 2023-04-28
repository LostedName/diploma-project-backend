import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { UserEntity } from './user.entity';
import { OauthClientEntity } from './oauth-client.entity';

@Entity({ name: 'oauth_application', schema: 'public' })
export class OauthApplicationEntity extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Some foreign application',
    description: 'Oauth application name',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    example: null,
    description: 'Oauth application deletion date',
    required: true,
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.oauth_applications, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @JoinColumn({ name: 'oauth_application_id' })
  @OneToMany(
    () => OauthClientEntity,
    (appClient) => appClient.oauth_application,
    {
      cascade: true,
    },
  )
  oauth_clients: OauthClientEntity[];
}
