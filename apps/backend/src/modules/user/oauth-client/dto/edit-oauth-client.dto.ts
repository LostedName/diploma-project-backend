import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class EditOauthClientDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl({ protocols: ['http', 'https'] })
  @IsNotEmpty()
  @IsOptional()
  homepageUrl: string;

  @IsArray()
  @IsUrl({ protocols: ['http', 'https'] }, { each: true })
  @IsOptional()
  redirectUris: string[];

  @IsUrl({ protocols: ['http', 'https'] })
  @IsNotEmpty()
  @IsOptional()
  iconUrl: string;
}

export class GenerateOauthClientSecretDto {
  @IsNumber()
  @IsNotEmpty()
  applicationId: number;

  @IsNumber()
  @IsNotEmpty()
  secretId: number;
}
