import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    example: 'Karl',
    description: 'User new firstname',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Rodstein',
    description: 'User new lastname',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
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
