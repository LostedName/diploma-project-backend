import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class GetOauthClientParamsDto {
  @Transform((val) => parseInt(val.value))
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  clientId: number;
}
