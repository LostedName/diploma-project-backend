import { UserEntity } from './../../../../../../shared/src/modules/database/entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'apps/shared/src/utils/validation/password-validation.decorator';
import { DtoProperty } from 'apps/shared/src/utils/pipes/sanitize-dto.pipe';

export class OAuthLoginDto {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'Account email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'strong password',
    description: 'Account password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidPassword(true)
  password: string;

  @ApiProperty({
    example: ['note:edit', 'note:read'],
    description: 'Scopes',
    required: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  scopes: string[];
}

export class OAuthLoginResultDto {
  @ApiProperty({ description: 'User data-source', required: true })
  @DtoProperty
  user: UserEntity;

  @ApiProperty({ description: 'Api token', required: true })
  @DtoProperty
  token: string;
}
