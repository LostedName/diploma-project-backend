import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  RequestIdentity,
  RequestWithIdentity,
} from '../../../backend/src/modules/request-identity/request-identity';

@Injectable({ scope: Scope.REQUEST })
export class RequestActor {
  @Inject(REQUEST) request: RequestWithIdentity;

  get requestIdentity(): RequestIdentity {
    return this.request.requestIdentity;
  }
}
