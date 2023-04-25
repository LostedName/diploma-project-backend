import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LinksService } from './links.service';

@Module({
  imports: [ConfigModule],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
