import { ScopeFormat } from './../../../../../../shared/src/modules/oauth/scopes/scopes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OAuthScreenParamsDto {
  @ApiProperty({
    example: 'client_id',
    description: 'Client id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: 'http://localhost:3000/oauth',
    description: 'redirect url',
    required: true,
  })
  @IsUrl({ protocols: ['http', 'https'], allow_fragments: true })
  @IsString()
  @IsNotEmpty()
  redirect_url: string;

  @ApiProperty({
    example: 'note:edit note:read',
    description: 'Scopes',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scopes: string;
}

export class OAuthScreenResponse {
  scopeInfo: ScopeFormat;
  clientLogoUrl: string;
  clientName: string;
  clientDescription: string;
  clientHomeUrl: string;
}
