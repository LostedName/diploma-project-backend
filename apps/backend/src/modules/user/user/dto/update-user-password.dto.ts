import { IsValidPassword } from 'apps/shared/src/utils/validation/password-validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({
    example: 'Old password',
    description: 'Old account password to verify your identity',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidPassword(true)
  oldPassword: string;

  @ApiProperty({
    example: 'New strong password',
    description: 'New account password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidPassword(true)
  newPassword: string;
}
