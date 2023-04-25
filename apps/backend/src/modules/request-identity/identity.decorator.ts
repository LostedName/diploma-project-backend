import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractRequestIdentity } from './identity-extractor.middleware';

export const Identity = createParamDecorator(
  async (data, context: ExecutionContext) => {
    return extractRequestIdentity(context.switchToHttp().getRequest());
  },
);
