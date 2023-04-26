import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOauthAppDto {
  @ApiProperty({
    example: 'My foreign application',
    description: 'Oauth application name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
