import { MainDatabaseModule } from './../../../../shared/src/modules/database/main-database.module';
import { Module } from '@nestjs/common';
import { UserAuthGatewayModule } from '../user/auth/user-auth-gateway.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    MainDatabaseModule,
    UserAuthGatewayModule,
  ],
  providers: [],
})
export class BackendAuthAppModule {}
