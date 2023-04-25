import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { UserEntity } from './user.entity';
import { ApplicationClientEntity } from './application-client.entity';

@Entity({ name: 'application', schema: 'public' })
export class ApplicationEntity extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Application name',
    description: 'Application name',
    type: String,
  })
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.applications, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @JoinColumn({ name: 'application_id' })
  @OneToMany(
    () => ApplicationClientEntity,
    (appClient) => appClient.application,
    {
      cascade: true,
    },
  )
  client_applications: ApplicationClientEntity[];
}
