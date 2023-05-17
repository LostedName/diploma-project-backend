import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationResponseDto {
  @ApiProperty({ description: 'Auth token' })
  readonly token: string;

  @ApiProperty({ description: 'Is user verified' })
  readonly verified: boolean;
}
