import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'system_settings', schema: 'public' })
export class SystemSettingsEntity extends BaseEntity {
  @ApiProperty({
    example: 654,
    description: 'Admin unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Vat',
    required: true,
  })
  @Column({ nullable: false })
  vat: number;

  @ApiProperty({
    description: 'Verification link live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  registration_verification_tts_seconds: number; // In seconds

  @ApiProperty({
    description: 'Job seeker session live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  user_session_duration_seconds: number; // In seconds

  @ApiProperty({
    description: 'Admin session live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  admin_session_duration_seconds: number; // In seconds

  @ApiProperty({
    description: 'Oauth 2.0 session live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  oauth_session_duration_seconds: number; // In seconds

  @ApiProperty({
    description: 'Refresh session live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  oauth_refresh_duration_seconds: number; // In seconds

  @ApiProperty({
    description: 'Number of login attempts after which user is blocked',
    required: true,
  })
  @Column({ nullable: false })
  user_allowed_login_attempts: number;

  @ApiProperty({
    description: 'Number of login attempts after which admin is blocked',
    required: true,
  })
  @Column({ nullable: false })
  admin_allowed_login_attempts: number;

  @ApiProperty({
    description: '2fa live span in seconds',
    required: true,
  })
  @Column({ nullable: false })
  two_factor_authentication_ttl_seconds: number; // in seconds

  @ApiProperty({
    description: 'List of emails for mailing operational system reports',
    required: true,
  })
  @Column('simple-array')
  mailing_list: string[];
}
