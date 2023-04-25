import { MainDatabaseModule } from './../../../../shared/src/modules/database/main-database.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from '../../configuration/configuration';
import { IdentityExtractorModule } from '../request-identity/identity-extractor.module';
import { SystemSettingsGatewayModule } from '../settings/system-settings-gateway.module';
import { UserAuthGatewayModule } from '../user/auth/user-auth-gateway.module';
import { AdminAuthGatewayModule } from '../admin/auth/admin-auth-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    IdentityExtractorModule,
    MainDatabaseModule,
    SystemSettingsGatewayModule,
    UserAuthGatewayModule,
    AdminAuthGatewayModule,
  ],
  providers: [],
})
export class BackendAppModule {}
