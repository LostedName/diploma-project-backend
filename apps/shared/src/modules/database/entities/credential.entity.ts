import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';

@Entity({ name: 'credentials', schema: 'public' })
export class CredentialEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'Note unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '$2b$10$NbShWaEfvwzDAS86GF48KOXmv8WSQmvh3GnCVvhZ/aGx3tbnLvoQa',
    description: 'User hashed password',
  })
  @Column({ nullable: true, default: null })
  password: string;

  @ApiProperty({ description: 'User token for password change' })
  @Column({ nullable: true, default: null })
  change_password_token: string;
}
