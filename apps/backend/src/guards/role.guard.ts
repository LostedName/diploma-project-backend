import { AccountRole } from './../../../shared/src/modules/database/entities/account.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { extractRequestIdentity } from '../modules/request-identity/identity-extractor.middleware';
import { isNil } from 'lodash';
import { RoleClaims } from '../../../shared/src/modules/authorisation/authorisations/app-authorisation';
import { ForbiddenAction, UnauthorisedAction } from '../errors/app-errors';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const requestIdentity = extractRequestIdentity(
      context.switchToHttp().getRequest(),
    );

    if (isNil(requestIdentity?.authorisation)) {
      throw new UnauthorisedAction();
    }

    const roleClaims = await requestIdentity.authorisation.getClaim(RoleClaims);
    if (isNil(roleClaims)) {
      throw new ForbiddenAction();
    }

    if (
      roleClaims.role === AccountRole.Admin &&
      requiredRoles.includes(AccountRole.Admin)
    ) {
      return true;
    }

    const result = requiredRoles.some((role) => role === roleClaims.role);
    if (!result) {
      throw new ForbiddenAction();
    }

    return true;
  }
}
