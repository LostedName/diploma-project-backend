import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// GET AUTH DATA FOR SERVICE
export const AuthData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.auth;
});
