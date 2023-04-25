import { AdminEntity } from './../../../../../../shared/src/modules/database/entities/admin.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from '../../../../../../shared/src/utils/validation/password-validation.decorator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsValidPassword(true)
  password: string;
}

export class AdminLoginResultDto {
  admin: AdminEntity;
  token: string;
}
