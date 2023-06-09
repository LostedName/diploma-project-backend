import { OAuthScope } from './../../../shared/src/modules/oauth/scopes/scope-definition';
import { ForbiddenAction } from './../../../shared/src/errors/app-errors';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { extractRequestIdentity } from '../modules/request-identity/identity-extractor.middleware';
import { isNil } from 'lodash';
import { OAuthClaims } from '../../../shared/src/modules/authorisation/authorisations/app-authorisation';

export const SCOPES_KEY = 'scopes';
export const Scopes = (...scopes: OAuthScope[]) =>
  SetMetadata(
    SCOPES_KEY,
    scopes.map((scope) => scope.identifier),
  );

@Injectable()
export class OauthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedMethodScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const scopeGuardExist = !isNil(allowedMethodScopes);

    const requestIdentity = extractRequestIdentity(context.switchToHttp().getRequest());

    if (isNil(requestIdentity?.authorisation)) {
      //No authorization at all
      return true;
    }

    const oauthClaims = await requestIdentity.authorisation.getClaim(OAuthClaims);

    if (!isNil(oauthClaims)) {
      // OAuth token
      if (!scopeGuardExist) {
        console.log('Method not intended to use with oauth token');
        throw new ForbiddenAction();
      }

      const allowedTokenScopes = oauthClaims.getScopes();
      let accessAllowed = false || allowedMethodScopes.length === 0;

      allowedMethodScopes.forEach((methodScope) => {
        accessAllowed = allowedTokenScopes.includes(methodScope) || accessAllowed;
      });
      if (!accessAllowed) {
        console.log('Token allowed scopes unsuitable for this method');
        throw new ForbiddenAction();
      }
    }

    return true;
  }
}
