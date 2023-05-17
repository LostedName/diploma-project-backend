import { ApiProperty } from '@nestjs/swagger';

export class TwoFactorAuthResponseDto {
  @ApiProperty({ description: 'User token' })
  readonly token: string;
}
