import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { extractRequestIdentity } from '../modules/request-identity/identity-extractor.middleware';
import { isNil } from 'lodash';
import { UnauthorisedAction } from '../errors/app-errors';

@Injectable()
export class AuthorisedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestIdentity = extractRequestIdentity(
      context.switchToHttp().getRequest(),
    );
    if (isNil(requestIdentity?.authorisation)) {
      throw new UnauthorisedAction();
    }

    return true;
  }
}
