import { MainDatabaseModule } from './../../../../shared/src/modules/database/main-database.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import configuration from '../../configuration/configuration';
import { IdentityExtractorModule } from '../request-identity/identity-extractor.module';
import { SystemSettingsGatewayModule } from '../settings/system-settings-gateway.module';
import { AdminAuthGatewayModule } from '../admin/auth/admin-auth-gateway.module';
import { UserNoteGatewayModule } from '../user/note/user-note-gateway.module';
import { OauthAppGatewayModule } from '../user/oauth-application/oauth-app-gateway.module';
import { OauthClientGatewayModule } from '../user/oauth-client/oauth-client-gateway.module';
import { OauthGuard } from '../../guards/oauth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    IdentityExtractorModule,
    MainDatabaseModule,
    SystemSettingsGatewayModule,
    AdminAuthGatewayModule,
    UserNoteGatewayModule,
    OauthAppGatewayModule,
    OauthClientGatewayModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OauthGuard,
    },
  ],
})
export class BackendAppModule {}
