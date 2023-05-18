import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOauthClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl({ protocols: ['http', 'https'] })
  @IsNotEmpty()
  homepageUrl: string;

  @IsArray({})
  @IsUrl({ protocols: ['http', 'https'] }, { each: true })
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  redirectUrls: string[];
}
