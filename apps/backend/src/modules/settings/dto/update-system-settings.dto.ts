import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateSystemSettingsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  vat: number;

  @ApiPropertyOptional({
    description: 'Verification link live span in seconds',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  registrationVerificationTts: number;

  @ApiPropertyOptional({
    description: 'Job seeker session live span in seconds',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  jobSeekerSessionDuration: number;

  @ApiPropertyOptional({ description: 'Admin session live span in seconds' })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  adminSessionDurationHours: number;

  @ApiPropertyOptional({
    description: 'Number of login attempts after which user is blocked',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  jobSeekerAllowedLoginAttempts: number;

  @ApiPropertyOptional({
    description: 'Number of login attempts after which admin is blocked',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  adminAllowedLoginAttempts: number;

  @ApiPropertyOptional({ description: '2fa live span in seconds' })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  twoFactorAuthenticationTtl: number;

  @ApiPropertyOptional({
    description: 'List of emails for mailing operational system reports',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mailingList: string[];
}
