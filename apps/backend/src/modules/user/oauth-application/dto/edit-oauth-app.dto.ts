import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditOauthAppDto {
  @ApiProperty({
    example: 'My new name',
    description: 'New oauth application name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
