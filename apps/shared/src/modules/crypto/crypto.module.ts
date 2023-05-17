import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
