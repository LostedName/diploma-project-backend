import { ApiProperty } from '@nestjs/swagger';

export class ConfirmRegistrationResponseDto {
  @ApiProperty({ example: 'ADC123', description: 'User token' })
  readonly token: string;
}
