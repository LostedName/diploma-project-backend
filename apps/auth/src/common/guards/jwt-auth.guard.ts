import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Request, Response } from 'express';
import { AuthContent, AuthService } from 'apps/shared/src/modules/auth/auth.service';
import { CanNotVerifyToken, TokenInvalidOrExpired } from 'apps/shared/src/errors/app-errors';

const MAX_DAYS_NUMBER = 8;

export enum TokenType {
  Confirmation = 0,
  Authentication = 1,
  Access = 2,
  ChangePassword = 3,
}

// CHECKING IS TOKEN VALID AND VERIFIABLE
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequestFromContext(context);
    const res = this.getResponseFromContext(context);

    const authHeader = req.headers.authorization;
    const token = this.authService.validateToken(authHeader);

    await this.verifyToken(req, token);

    this.matchTokenTypeAndRequestedPath(req);

    if (req.auth.type === TokenType.Access) {
      const expression = this.checkExpirationDate(token);
      if (expression) {
        await this.signNewToken(req, res);
      }
    }

    return true;
  }

  private getRequestFromContext(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  private getResponseFromContext(context: ExecutionContext): Response {
    return context.switchToHttp().getResponse();
  }

  private async verifyToken(req: Request, token: string): Promise<void> {
    try {
      req.auth = await this.authService.verifyToken(token);
      return;
    } catch (error) {
      throw new CanNotVerifyToken();
    }
  }

  private matchTokenTypeAndRequestedPath(req: Request): void {
    const routeExpression1 = req.route.path === '/api/user/auth/confirm-registration';
    const routeExpression2 =
      req.route.path === '/api/user/auth/2f-auth' || req.route.path === '/api/user/auth/resend/auth';
    const routeExpression3 =
      req.route.path === '/api/user/auth/reset-password' || req.route.path === '/api/user/auth/verify-password-token';

    if (req.auth.type === TokenType.Confirmation && !routeExpression1) throw new TokenInvalidOrExpired();
    else if (req.auth.type === TokenType.Authentication && !routeExpression2) {
      throw new TokenInvalidOrExpired();
    } else if (req.auth.type === TokenType.ChangePassword && !routeExpression3) {
      throw new TokenInvalidOrExpired();
    }

    return;
  }

  private checkExpirationDate(token: string): boolean {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const exp = moment.unix(payload.exp);
    const now = moment();

    const diff = now.diff(exp, 'days');

    return diff < MAX_DAYS_NUMBER;
  }

  private async signNewToken(req: Request, res: Response): Promise<void> {
    const payload: AuthContent = {
      userId: req.auth.userId,
      role: req.auth.role,
      type: req.auth.type,
    };
    const newToken = await this.authService.generateAccessToken(payload);
    res.set({ 'x-access-token': newToken });

    return;
  }
}
