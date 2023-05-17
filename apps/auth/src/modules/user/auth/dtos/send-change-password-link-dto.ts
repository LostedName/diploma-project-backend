import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessage } from 'apps/auth/src/utils/validation/validation-message';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendChangePasswordLinkDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'User email' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  @IsEmail({}, { message: ValidationMessage('Invalid email address') })
  readonly email: string;
}
