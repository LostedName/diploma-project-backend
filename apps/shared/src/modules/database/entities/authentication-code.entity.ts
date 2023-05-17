import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';

@Entity({ name: 'authentication_codes', schema: 'public' })
export class AuthenticationCodeEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'User unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'U45645', description: 'User 2F auth code' })
  @Column()
  code: string;
}
