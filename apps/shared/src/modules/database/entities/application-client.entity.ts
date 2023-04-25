import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { ApplicationEntity } from './application.entity';

@Entity({ name: 'application_client', schema: 'public' })
export class ApplicationClientEntity extends AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Client id',
    description: 'Application client id',
    type: String,
    required: true,
  })
  @Column({ unique: true })
  client_id: string;

  @ApiProperty({
    example: 'Client secret',
    description: 'Hashed application client secret',
    type: String,
    required: true,
  })
  @Column()
  client_secret: string;

  @ApiProperty({
    example: 'Application client name',
    description: 'Application client name',
    type: String,
    required: true,
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    example: 'Application client description',
    description: 'Application client description',
    type: String,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: '',
    description: '',
    type: String,
    required: true,
  })
  @Column()
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

  @ManyToOne(() => ApplicationEntity, (app) => app.client_applications, {
    onDelete: 'CASCADE',
  })
  application: ApplicationEntity;
}
