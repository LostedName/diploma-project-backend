import { UserEntity } from './../../../../../../shared/src/modules/database/entities/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'apps/shared/src/utils/validation/password-validation.decorator';
import { DtoProperty } from 'apps/shared/src/utils/pipes/sanitize-dto.pipe';

export class UserAccountRegistrationDto {
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
    example: '123456A1QA',
    description: 'Account password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidPassword(true)
  password: string;

  @ApiProperty({
    example: 'Dmitry',
    description: 'User first name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  firstName: string;

  @ApiProperty({
    example: 'Karpenkin',
    description: 'User last name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  lastName: string;

  @ApiProperty({
    example: 'https://vk.com/img.png',
    description: 'User new avatar url',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl({ protocols: ['http', 'https'] })
  @IsOptional()
  avatarUrl: string;
}

export class UserLoginDto {
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
}

export class UserLoginResultDto {
  @ApiProperty({ description: 'User data-source', required: true })
  @DtoProperty
  user: UserEntity;

  @ApiProperty({ description: 'Api token', required: true })
  @DtoProperty
  token: string;
}
