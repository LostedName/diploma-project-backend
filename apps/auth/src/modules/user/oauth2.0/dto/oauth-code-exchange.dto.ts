import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OAuthCodeExchangeDto {
  @ApiProperty({
    example: 'authorization_code',
    description: 'Grant type',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Equals('authorization_code')
  grant_type: string;

  @ApiProperty({
    example: 'client_id',
    description: 'Client id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: 'client_secret',
    description: 'Client secret',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  client_secret: string;

  @ApiProperty({
    example: 'http://upwork.com/oauth',
    description: 'redirect uri',
    required: true,
  })
  @IsUrl({ protocols: ['http', 'https'], allow_fragments: true })
  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

  @ApiProperty({
    example: 'Some_authorization_code',
    description: 'Authorization code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class OAuthCodeExchangeResponse {
  access_token: string;
  token_type: string;
  scopes: string;
}
