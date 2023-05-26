import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from 'apps/auth/src/common/guards/jwt-auth.guard';
import { UserEntity } from '../database/entities/user.entity';
import { AuthenticationCodeEntity } from '../database/entities/authentication-code.entity';
import { TokenInvalidOrExpired } from '../../errors/app-errors';
import { AccountRole } from '../database/entities/account.entity';

export type AuthContent = {
  userId: number;
  role: AccountRole;
  type: TokenType;
};

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: AuthContent): Promise<string> {
    return this.signToken(payload, '14d');
  }

  async generateIntermediateToken(payload: AuthContent): Promise<string> {
    return this.signToken(payload, '1h');
  }

  async generateChangePasswordToken(payload: AuthContent): Promise<string> {
    return this.signToken(payload, '1h');
  }

  async verifyToken(token: string): Promise<AuthContent> {
    return this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string): Promise<any> {
    const decoded = this.jwtService.decode(token);
    return <AuthContent>decoded;
  }

  validateToken(authHeader: string): string {
    const bearer = authHeader?.split(' ')[0];
    const token = authHeader?.split(' ')[1];
    if (bearer !== 'Bearer' || !token) throw new TokenInvalidOrExpired();

    return token;
  }

  generateTokenPayload(userId: number, role: AccountRole, type: TokenType): AuthContent {
    return { userId, role, type };
  }

  async generateUserAuthCode(user: UserEntity): Promise<string> {
    if (!user.account.authenticationCode) {
      const authenticationCode = new AuthenticationCodeEntity();
      user.account.authenticationCode = authenticationCode;
    }

    user.account.authenticationCode.code = uuid.v4().slice(-6).toUpperCase();

    await this.userService.save(user);

    return user.account.authenticationCode.code;
  }

  async deleteUserAuthCode(user: UserEntity): Promise<void> {
    const authCodes: AuthenticationCodeEntity[] = [user.account.authenticationCode];

    user.account.authenticationCode = null;

    await this.userService.save(user);

    this.userService.removeAuthCodes(authCodes);
  }

  private async signToken(payload: AuthContent, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn });
  }
}
