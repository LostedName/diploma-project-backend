import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { AuthenticationCodeEntity } from './authentication-code.entity';
import { CredentialEntity } from './credential.entity';

export enum AccountRole {
  User = 1,
  Admin = 2,
}

export enum AuthenticationMethod {
  Password = 1,
}

export enum AccountStatus {
  Enabled,
  Suspended = 1,
}

@Entity({ name: 'accounts', schema: 'public' })
export class AccountEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'Account unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'k.velez@gmail.com',
    description: 'Account unique email',
    required: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '1',
    description: 'Role of account',
    required: true,
  })
  @Column({ default: AccountRole.User })
  role: AccountRole;

  @ApiProperty({
    example: 'false',
    description: 'If account is verified',
    required: true,
  })
  @Column({ default: false })
  verified: boolean;

  @ApiProperty({
    example: '1',
    description: 'Authorisation method',
    required: true,
  })
  @Column({ default: AuthenticationMethod.Password })
  authentication_method: AuthenticationMethod;

  @ApiProperty({
    description: 'Account status',
    required: true,
  })
  @Column({ default: AccountStatus.Enabled })
  status: AccountStatus;

  hasAuthenticationMethod(authentication_method: AuthenticationMethod): boolean {
    return this.authentication_method === authentication_method;
  }

  hasRole(role: AccountRole): boolean {
    return this.role === role;
  }

  @OneToOne(() => AuthenticationCodeEntity, { cascade: true })
  @JoinColumn()
  authenticationCode: AuthenticationCodeEntity;

  @OneToOne(() => CredentialEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  credential: CredentialEntity;
}
