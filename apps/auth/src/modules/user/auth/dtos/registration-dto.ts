import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessage } from 'apps/auth/src/utils/validation/validation-message';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'User email' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  @IsEmail({}, { message: ValidationMessage('Invalid email address') })
  readonly email: string;

  @ApiProperty({ example: '123asd', description: 'User password' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly password: string;

  @ApiProperty({ example: 'Kinsley', description: 'User firstname' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly first_name: string;

  @ApiProperty({ example: 'Velez', description: 'User lastname' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly last_name: string;

  @ApiProperty({ example: 'Velez', description: 'User lastname' })
  @IsOptional()
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly avatar_url: string | undefined;
}
