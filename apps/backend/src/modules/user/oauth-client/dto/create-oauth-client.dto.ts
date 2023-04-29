import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateOauthClientDto {
  @IsNumber()
  @IsNotEmpty()
  applicationId: number;

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
