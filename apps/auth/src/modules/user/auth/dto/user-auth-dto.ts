import {
  UserEntity,
  UserGender,
} from './../../../../../../shared/src/modules/database/entities/user.entity';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
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

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  @ApiProperty()
  lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @Transform((val) => parseInt(val.value))
  @IsEnum(UserGender)
  gender: UserGender;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;
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
