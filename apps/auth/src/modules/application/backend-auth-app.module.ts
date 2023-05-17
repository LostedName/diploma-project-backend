import { MainDatabaseModule } from './../../../../shared/src/modules/database/main-database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../configuration/configuration';
import { OAuthGatewayModule } from '../user/oauth2.0/oauth-gateway.module';
import { UserAuthGatewayModule } from '../user/auth/auth-gateway.module';

@Module({
  imports: [ConfigModule.forRoot(configuration()), MainDatabaseModule, UserAuthGatewayModule, OAuthGatewayModule],
  providers: [],
})
export class BackendAuthAppModule {}
