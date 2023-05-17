import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessage } from 'apps/auth/src/utils/validation/validation-message';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'User new password' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly password: string;

  @ApiProperty({ description: 'User new password' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly repeatPassword: string;

  @ApiProperty({ description: 'User token' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly token: string;
}
