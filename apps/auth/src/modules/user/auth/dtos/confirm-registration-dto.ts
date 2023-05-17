import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessage } from 'apps/auth/src/utils/validation/validation-message';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmRegistrationDto {
  @ApiProperty({ example: 'ADC123', description: 'User auth code' })
  @IsNotEmpty({ message: ValidationMessage('Can not be empty!') })
  @IsString({ message: ValidationMessage('Must be a string!') })
  readonly confirmationCode: string;
}
