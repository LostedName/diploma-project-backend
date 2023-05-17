import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/shared/src/modules/database/entities/user.entity';

export class AuthorizationResponseDto {
  @ApiProperty({ description: 'Access token' })
  readonly token: string;

  @ApiProperty({ type: UserEntity, description: 'User entity' })
  readonly user: UserEntity;
}
