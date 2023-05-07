import { BadToken } from './../../../../shared/src/errors/app-errors';
import { UserService } from './../../../../shared/src/modules/user/user.service';
import { AdminEntity } from './../../../../shared/src/modules/database/entities/admin.entity';
import { UserEntity } from './../../../../shared/src/modules/database/entities/user.entity';
import { AccountRole } from './../../../../shared/src/modules/database/entities/account.entity';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isNil } from 'lodash';
import { RequestIdentity, RequestWithIdentity } from './request-identity';
import { AuthorisationService } from '../../../../shared/src/modules/authorisation/authorisation.service';
import {
  MainClaims,
  OAuthClaims,
  RoleClaims,
} from '../../../../shared/src/modules/authorisation/authorisations/app-authorisation';
import { AdminService } from '../../../../shared/src/modules/admin/admin.service';

export function extractRequestIdentity(
  request: RequestWithIdentity,
): RequestIdentity | undefined {
  return request.requestIdentity || undefined;
}

@Injectable()
export class IdentityExtractorMiddleware implements NestMiddleware {
  constructor(
    readonly authorisationService: AuthorisationService,
    readonly adminService: AdminService,
    readonly userService: UserService,
  ) {}

  async use(
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const token = this.extractToken(req);
    console.log('Extract middleware');
    if (isNil(token)) {
      req.requestIdentity = RequestIdentity.createAnonymous();
    } else {
      const authorisation = await this.authorisationService.decodeAuthorisation(
        token,
      );
      const mainClaims = await authorisation.getClaim(MainClaims);
      const roleClaim = await authorisation.getClaim(RoleClaims);
      let user: AdminEntity | UserEntity | null = null;
      if (!isNil(roleClaim)) {
        try {
          if (roleClaim.role === AccountRole.Admin) {
            user = await this.adminService.findAdminByEmail(mainClaims.sub);
          } else {
            user = await this.userService.findUserByEmail(mainClaims.sub);
          }
        } catch (e) {
          throw new BadToken();
        }

        if (isNil(roleClaim)) {
          throw new BadToken();
        }
      }
      req.requestIdentity = new RequestIdentity(
        mainClaims.sub,
        user,
        authorisation,
      );
    }

    next();
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (isNil(authHeader)) {
      return null;
    }

    const authParts = authHeader.split(' ');
    if (authParts.length < 2) {
      return null;
    }
    const bearer = authParts[0];
    const token = authParts[1];

    if (bearer !== 'Bearer' || isNil(token)) {
      return null;
    }

    return token;
  }
}
