import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from '../../../../../../shared/src/utils/validation/password-validation.decorator';

export class AdminRegisterDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsValidPassword(true)
  password: string;
}
