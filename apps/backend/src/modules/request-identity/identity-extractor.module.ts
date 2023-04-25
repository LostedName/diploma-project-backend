import { UserModule } from './../../../../shared/src/modules/user/user.module';
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { IdentityExtractorMiddleware } from './identity-extractor.middleware';
import { AuthorisationModule } from '../../../../shared/src/modules/authorisation/authorisation.module';
import { AdminModule } from '../../../../shared/src/modules/admin/admin.module';

@Module({
  imports: [AuthorisationModule, UserModule, AdminModule],
  providers: [IdentityExtractorMiddleware],
  exports: [IdentityExtractorMiddleware],
})
export class IdentityExtractorModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(IdentityExtractorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
