import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OAuthConfirmConsentDto {
  @ApiProperty({
    example: 'client_id',
    description: 'Client id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: 'dmitrykarpenkin@gmail.com',
    description: 'User email',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

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
    example: 'note:edit note:read',
    description: 'Scopes',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scopes: string;
}

export class OAuthConfirmConsentResponse {
  code: string;
}
